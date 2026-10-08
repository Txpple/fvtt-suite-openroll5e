# migrate-layout.ps1 - one-time move of the Open Roll 5e family under the suite folder.
#
# RUN THIS FROM YOUR OWN POWERSHELL WITH THE CLAUDE DESKTOP APP CLOSED. The app holds MCP server
# processes rooted in these folders (Windows refuses to rename a folder a process lives in) and it
# rewrites ~\.claude.json on its own, which would clobber the path edits below.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File "<repos>\tools\migrate-layout.ps1" -Repos <repos> -DryRun
#   powershell -NoProfile -ExecutionPolicy Bypass -File "<repos>\tools\migrate-layout.ps1" -Repos <repos>
# where <repos> is the folder the fvtt-* clones sit in. (After a run that stopped partway the suite
# files have already moved, so the script is at <repos>\fvtt-suite-openroll5e\tools\migrate-layout.ps1;
# run it from there and it resumes.)
#
# Before:  <repos>\{suite files, fvtt-mod-*, fvtt-mcp-*, fvtt-app-*, fvtt-campaign-*}
# After:   <repos>\fvtt-suite-openroll5e\{suite files, fvtt-mod-*, fvtt-mcp-*}
#          <repos>\fvtt-campaign-*                      (campaigns stay above)
# and two renames on the way in (already renamed on GitHub 2026-10-08):
#          fvtt-app-artificer     -> fvtt-mcp-imagegen
#          fvtt-app-sessionscribe -> fvtt-mcp-sessionscribe
#
# What it does, in order:
#   1. refuses to run if Claude.exe is running (-DryRun and -Force skip that check). If the suite
#      folder already exists it resumes: siblings already inside it stay where they are, the rest
#      move in, and every later step runs over all of them, so a run that stopped partway is
#      finished by running the script again
#   2. records every git worktree of every repo it is about to move or has already moved
#   3. moves the suite repo's own files, then the sibling folders, into the suite folder (same
#      volume: instant renames, nothing is copied)
#   4. `git worktree repair` with the new paths, so Battle Flow's and Errata's worktrees reconnect
#   5. patches absolute paths in ~\.claude.json (MCP servers, per-project state) and in each moved
#      repo's local config (.claude\settings*.json, .mcp.json, .env*), after backing each file up
#   6. renames the per-project folders under ~\.claude\projects so session history and memory
#      follow the repos
#   7. prints a verification table
#
# Everything is a rename or a string replace; nothing is deleted. Backups: <file>.bak-migrate.
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Repos,
    [switch]$DryRun,
    [switch]$Force
)
$ErrorActionPreference = 'Stop'

$Repos     = (Resolve-Path -LiteralPath $Repos).Path.TrimEnd('\')
$SuiteName = 'fvtt-suite-openroll5e'
$Suite     = Join-Path $Repos $SuiteName
$SuiteFiles = @('.git', '.gitignore', 'CLAUDE.md', 'README.md', 'repos.json', 'sync.ps1', 'tools', 'docs')
$Renames = @{
    'fvtt-app-artificer'     = 'fvtt-mcp-imagegen'
    'fvtt-app-sessionscribe' = 'fvtt-mcp-sessionscribe'
}
$StayAbove = '^fvtt-campaign-'

function Say($msg) { Write-Host $msg }
function Act($msg) { if ($DryRun) { Write-Host "  [dry-run] $msg" -ForegroundColor DarkGray } else { Write-Host "  $msg" } }

# ---- 1. preconditions -------------------------------------------------------------------------
if (-not (Test-Path $Repos)) { throw "$Repos does not exist; nothing to migrate." }
$Resume = Test-Path $Suite
if (-not (Test-Path (Join-Path $Repos '.git')) -and -not (Test-Path (Join-Path $Suite '.git'))) {
    throw "Neither $Repos nor $Suite holds the suite repo (no .git); nothing done."
}
$claude = Get-Process -Name 'Claude' -ErrorAction SilentlyContinue
if ($claude -and -not $Force -and -not $DryRun) {
    throw "Claude.exe is running ($($claude.Count) process(es)). Quit the desktop app first, or pass -Force if you are sure no session is open in an FVTT folder."
}

# ---- 2. plan the moves ------------------------------------------------------------------------
# $Moves: old folder name (under $Repos) -> new folder name (under $Suite)
$Moves = [ordered]@{}
Get-ChildItem -Path $Repos -Directory -Filter 'fvtt-*' | Sort-Object Name | ForEach-Object {
    $n = $_.Name
    if ($n -eq $SuiteName) { return }
    if ($n -match $StayAbove) { return }
    if ($Renames.ContainsKey($n)) { $Moves[$n] = $Renames[$n] } else { $Moves[$n] = $n }
}
# $Done: siblings already inside $Suite (a previous run that stopped partway), old name -> new name
$Reverse = @{}
foreach ($k in $Renames.Keys) { $Reverse[$Renames[$k]] = $k }
$Done = [ordered]@{}
if ($Resume) {
    Get-ChildItem -Path $Suite -Directory -Filter 'fvtt-*' | Sort-Object Name | ForEach-Object {
        $n = $_.Name
        $old = if ($Reverse.ContainsKey($n)) { $Reverse[$n] } else { $n }
        if ($Moves.Contains($old)) { throw "$old is both under $Repos and (as $n) under $Suite; sort that out by hand first." }
        $Done[$old] = $n
    }
}
# $All: every sibling, moved or not, old name -> new name. Repair, patching, renaming and
# verification run over this; only the move step uses $Moves.
$All = [ordered]@{}
foreach ($k in $Done.Keys) { $All[$k] = $Done[$k] }
foreach ($k in $Moves.Keys) { $All[$k] = $Moves[$k] }
if ($All.Count -eq 0) { throw "No fvtt-* folders found under $Repos or $Suite; nothing to do." }
# Where a sibling is right now, before the move step.
function Current-Path([string]$old) { if ($Moves.Contains($old)) { Join-Path $Repos $old } else { Join-Path $Suite $All[$old] } }

Say ""
Say "Suite folder: $Suite$(if ($Resume) { ' (exists: resuming)' })"
Say "Suite files to move in: $($SuiteFiles -join ', ')"
if ($Done.Count) {
    Say "Already in the suite folder:"
    foreach ($k in $Done.Keys) {
        if ($k -ne $Done[$k]) { Say ("  {0,-32} -> {1}" -f $k, $Done[$k]) } else { Say ("  {0,-32}" -f $k) }
    }
}
Say "Sibling folders to move in:$(if (-not $Moves.Count) { ' (none)' })"
foreach ($k in $Moves.Keys) {
    if ($k -ne $Moves[$k]) { Say ("  {0,-32} -> {1}" -f $k, $Moves[$k]) } else { Say ("  {0,-32}" -f $k) }
}
Say "Staying above (in $Repos):"
Get-ChildItem -Path $Repos -Directory | Where-Object { $_.Name -match $StayAbove } | ForEach-Object { Say "  $($_.Name)" }
Say ""

# Path mapping used for worktree repair and config patching. Longest old names first so
# fvtt-mod-battleflow-cover is matched before fvtt-mod-battleflow.
$PathMap = @()
foreach ($k in ($All.Keys | Sort-Object { $_.Length } -Descending)) {
    $PathMap += [pscustomobject]@{ Old = (Join-Path $Repos $k); New = (Join-Path $Suite $All[$k]) }
}
function Map-Path([string]$p) {
    $norm = $p -replace '/', '\'
    foreach ($m in $PathMap) {
        if ($norm.Length -ge $m.Old.Length -and $norm.Substring(0, $m.Old.Length) -ieq $m.Old) {
            $rest = $norm.Substring($m.Old.Length)
            if ($rest -eq '' -or $rest.StartsWith('\')) { return $m.New + $rest }
        }
    }
    return $norm
}

# ---- 2b. record worktrees before anything moves ----------------------------------------------
$WorktreeRepairs = @()   # @{ Repo = <new main path>; Paths = @(<new worktree paths>) }
foreach ($k in $All.Keys) {
    $old = Current-Path $k
    $git = Join-Path $old '.git'
    if (-not (Test-Path $git)) { continue }
    if ((Get-Item $git -Force) -is [System.IO.FileInfo]) { continue }   # a worktree itself; its main repo repairs it
    $list = git -C $old worktree list --porcelain 2>$null
    if (-not $list) { continue }
    $paths = @($list | Where-Object { $_ -like 'worktree *' } | ForEach-Object { $_.Substring(9) })
    if ($paths.Count -le 1) { continue }
    $linked = $paths | Select-Object -Skip 1 | ForEach-Object { Map-Path $_ }
    $WorktreeRepairs += @{ Repo = (Join-Path $Suite $All[$k]); Paths = @($linked) }
    Say "Worktrees of ${k}:"
    foreach ($p in $linked) { Say "  $p" }
}
Say ""

# ---- 3. move -----------------------------------------------------------------------------------
Say "Moving..."
if (-not $Resume) {
    Act "mkdir $Suite"
    if (-not $DryRun) { New-Item -ItemType Directory -Path $Suite | Out-Null }
}
foreach ($f in $SuiteFiles) {
    $src = Join-Path $Repos $f
    if (-not (Test-Path $src)) { continue }
    Act "$f -> $SuiteName\$f"
    if (-not $DryRun) { Move-Item -LiteralPath $src -Destination (Join-Path $Suite $f) -Force }
}
foreach ($k in $Moves.Keys) {
    $src = Join-Path $Repos $k
    $dst = Join-Path $Suite $Moves[$k]
    Act "$k -> $SuiteName\$($Moves[$k])"
    if (-not $DryRun) {
        try { Move-Item -LiteralPath $src -Destination $dst -Force }
        catch { throw "Could not move $k ($($_.Exception.Message)). A process probably has it open. Close it and run the script again: it resumes, leaving the folders already moved where they are." }
    }
}
Say ""

# ---- 4. worktree repair -----------------------------------------------------------------------
if ($WorktreeRepairs.Count) {
    Say "Repairing worktrees..."
    foreach ($w in $WorktreeRepairs) {
        Act "git -C $($w.Repo) worktree repair $($w.Paths -join ' ')"
        # no stderr redirect: under Windows PowerShell 5.1 with ErrorActionPreference Stop, a redirected
        # stderr line from a native command becomes a terminating error
        if (-not $DryRun) { git -C $w.Repo worktree repair @($w.Paths) | ForEach-Object { Say "    $_" } }
    }
    Say ""
}

# ---- 5. patch absolute paths ------------------------------------------------------------------
# Three spellings occur in the wild: <repos>\x, <repos>\\x with doubled backslashes (JSON), <repos>/x with forward slashes
function Patch-File([string]$file) {
    if (-not (Test-Path $file)) { return }
    $text = Get-Content -LiteralPath $file -Raw
    $orig = $text
    foreach ($m in $PathMap) {
        $oldName = Split-Path $m.Old -Leaf
        $newName = Split-Path $m.New -Leaf
        # plain, JSON-escaped (doubled backslashes), forward slashes
        # (each element parenthesised: in PowerShell the comma binds tighter than +)
        $pairs = @(
            @(("$Repos\$oldName"),                               ("$Suite\$newName")),
            @(($Repos.Replace('\', '\\') + '\\' + $oldName),     ($Suite.Replace('\', '\\') + '\\' + $newName)),
            @(($Repos.Replace('\', '/') + '/' + $oldName),       ($Suite.Replace('\', '/') + '/' + $newName))
        )
        foreach ($p in $pairs) {
            $pattern = [regex]::Escape($p[0]) + '(?![\w-])'
            $replacement = $p[1].Replace('$', '$$')
            $text = [regex]::Replace($text, $pattern, $replacement)
        }
    }
    if ($text -ne $orig) {
        Act "patched $file"
        if (-not $DryRun) {
            Copy-Item -LiteralPath $file -Destination "$file.bak-migrate" -Force
            [System.IO.File]::WriteAllText($file, $text, (New-Object System.Text.UTF8Encoding($false)))
        }
    }
}
Say "Patching absolute paths..."
Patch-File (Join-Path $env:USERPROFILE '.claude.json')
foreach ($k in $All.Keys) {
    $repo = if ($DryRun) { Current-Path $k } else { Join-Path $Suite $All[$k] }
    foreach ($f in @('.mcp.json', '.claude\settings.json', '.claude\settings.local.json')) { Patch-File (Join-Path $repo $f) }
    Get-ChildItem -Path $repo -Filter '.env*' -File -Force -ErrorAction SilentlyContinue | ForEach-Object { Patch-File $_.FullName }
}
# The campaign repos stay put, but their hooks may name a moved repo.
Get-ChildItem -Path $Repos -Directory | Where-Object { $_.Name -match $StayAbove } | ForEach-Object {
    foreach ($f in @('.mcp.json', '.claude\settings.json', '.claude\settings.local.json')) { Patch-File (Join-Path $_.FullName $f) }
    Get-ChildItem -Path $_.FullName -Filter '.env*' -File -Force -ErrorAction SilentlyContinue | ForEach-Object { Patch-File $_.FullName }
}
Say ""

# ---- 6. Claude Code project folders -----------------------------------------------------------
# ~\.claude\projects\<cwd with every non-alphanumeric char replaced by '-'>. Rename so history and
# memory follow. Longest old names first, exact or followed by '-'.
$projects = Join-Path $env:USERPROFILE '.claude\projects'
if (Test-Path $projects) {
    Say "Renaming Claude Code project folders..."
    $encRepos = ($Repos -replace '[^A-Za-z0-9]', '-')
    $encSuite = ($Suite -replace '[^A-Za-z0-9]', '-')
    $ordered = $All.Keys | Sort-Object { $_.Length } -Descending
    Get-ChildItem -Path $projects -Directory | ForEach-Object {
        $name = $_.Name
        $new = $null
        if ($name -eq $encRepos) { $new = $encSuite }   # sessions rooted at the old umbrella folder
        else {
            foreach ($k in $ordered) {
                $prefix = "$encRepos-$k"
                if ($name -eq $prefix -or $name.StartsWith("$prefix-")) {
                    $new = "$encSuite-$($All[$k])" + $name.Substring($prefix.Length)
                    break
                }
            }
        }
        if ($new -and $new -ne $name) {
            if (Test-Path (Join-Path $projects $new)) { Say "  SKIP ${name}: $new already exists" }
            else {
                Act "$name -> $new"
                if (-not $DryRun) { Rename-Item -LiteralPath $_.FullName -NewName $new }
            }
        }
    }
    Say ""
}

# ---- 7. verify ---------------------------------------------------------------------------------
if ($DryRun) { Say "Dry run complete. Nothing changed."; exit 0 }
Say "Verification:"
Say ("  {0,-34} {1}" -f 'suite repo', (git -C $Suite status -sb | Select-Object -First 1))
foreach ($k in $All.Keys) {
    $p = Join-Path $Suite $All[$k]
    $g = Join-Path $p '.git'
    if (-not (Test-Path $g)) { Say ("  {0,-34} {1}" -f $All[$k], 'present, not a git repo'); continue }
    $br = git -C $p rev-parse --abbrev-ref HEAD 2>$null
    $ok = if ($LASTEXITCODE -eq 0) { "ok, on $br" } else { 'GIT ERROR' }
    Say ("  {0,-34} {1}" -f $All[$k], $ok)
}
foreach ($w in $WorktreeRepairs) {
    Say "  worktrees of $(Split-Path $w.Repo -Leaf):"
    git -C $w.Repo worktree list | ForEach-Object { Say "    $_" }
}
$cj = Get-Content -LiteralPath (Join-Path $env:USERPROFILE '.claude.json') -Raw
$left = [regex]::Matches($cj, 'Repos[\\/]+fvtt-(mod|mcp|app)-').Count
Say "  ~\.claude.json: $left old-style path(s) left (campaign paths are expected to stay; 0 is ideal, a few stale project keys are harmless)"
Say ""
Say "Done. Next:"
Say "  1. Start the Claude desktop app and open a session at $Suite"
Say "  2. In it, run .\sync.ps1 -Status and check the MCP tools (foundry-*, imagegen, scribe) come up"
Say "  3. Delete the *.bak-migrate files once happy"
