# migrate-layout.ps1 - one-time move of the Open Roll 5e family under the suite folder.
#
# RUN THIS FROM YOUR OWN POWERSHELL WITH THE CLAUDE DESKTOP APP CLOSED. The app holds MCP server
# processes rooted in these folders (Windows refuses to rename a folder a process lives in) and it
# rewrites ~\.claude.json on its own, which would clobber the path edits below.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Workbench\FVTT\Repos\tools\migrate-layout.ps1" -DryRun
#   powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Workbench\FVTT\Repos\tools\migrate-layout.ps1"
#
# Before:  D:\Workbench\FVTT\Repos\{suite files, fvtt-mod-*, fvtt-mcp-*, fvtt-app-*, fvtt-campaign-*}
# After:   D:\Workbench\FVTT\Repos\fvtt-suite-openroll5e\{suite files, fvtt-mod-*, fvtt-mcp-*}
#          D:\Workbench\FVTT\Repos\fvtt-campaign-*                      (campaigns stay above)
# and two renames on the way in (already renamed on GitHub 2026-10-08):
#          fvtt-app-artificer     -> fvtt-mcp-imagegen
#          fvtt-app-sessionscribe -> fvtt-mcp-sessionscribe
#
# What it does, in order:
#   1. refuses to run if the suite folder already exists or Claude.exe is running (-DryRun and -Force skip the
#      process check)
#   2. records every git worktree of every repo it is about to move
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
    [switch]$DryRun,
    [switch]$Force
)
$ErrorActionPreference = 'Stop'

$Repos     = 'D:\Workbench\FVTT\Repos'
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
if (Test-Path $Suite) { throw "$Suite already exists. Already migrated? Nothing done." }
if (-not (Test-Path (Join-Path $Repos '.git'))) { throw "$Repos is not the suite repo (no .git); nothing done." }
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
if ($Moves.Count -eq 0) { throw "No fvtt-* folders found under $Repos; nothing to move." }

Say ""
Say "Suite folder: $Suite"
Say "Suite files to move in: $($SuiteFiles -join ', ')"
Say "Sibling folders to move in:"
foreach ($k in $Moves.Keys) {
    if ($k -ne $Moves[$k]) { Say ("  {0,-32} -> {1}" -f $k, $Moves[$k]) } else { Say ("  {0,-32}" -f $k) }
}
Say "Staying above (in $Repos):"
Get-ChildItem -Path $Repos -Directory | Where-Object { $_.Name -match $StayAbove } | ForEach-Object { Say "  $($_.Name)" }
Say ""

# Path mapping used for worktree repair and config patching. Longest old names first so
# fvtt-mod-battleflow-cover is matched before fvtt-mod-battleflow.
$PathMap = @()
foreach ($k in ($Moves.Keys | Sort-Object { $_.Length } -Descending)) {
    $PathMap += [pscustomobject]@{ Old = (Join-Path $Repos $k); New = (Join-Path $Suite $Moves[$k]) }
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
foreach ($k in $Moves.Keys) {
    $old = Join-Path $Repos $k
    $git = Join-Path $old '.git'
    if (-not (Test-Path $git)) { continue }
    if ((Get-Item $git -Force) -is [System.IO.FileInfo]) { continue }   # a worktree itself; its main repo repairs it
    $list = git -C $old worktree list --porcelain 2>$null
    if (-not $list) { continue }
    $paths = @($list | Where-Object { $_ -like 'worktree *' } | ForEach-Object { $_.Substring(9) })
    if ($paths.Count -le 1) { continue }
    $linked = $paths | Select-Object -Skip 1 | ForEach-Object { Map-Path $_ }
    $WorktreeRepairs += @{ Repo = (Join-Path $Suite $Moves[$k]); Paths = @($linked) }
    Say "Worktrees of ${k}:"
    foreach ($p in $linked) { Say "  $p" }
}
Say ""

# ---- 3. move -----------------------------------------------------------------------------------
Say "Moving..."
Act "mkdir $Suite"
if (-not $DryRun) { New-Item -ItemType Directory -Path $Suite | Out-Null }
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
        catch { throw "Could not move $k ($($_.Exception.Message)). A process probably has it open. Close it and rerun; moves already made are fine, the script will refuse to run again until you remove $Suite, so instead finish by hand: move the remaining folders, then run the patch steps (see the script body)." }
    }
}
Say ""

# ---- 4. worktree repair -----------------------------------------------------------------------
if ($WorktreeRepairs.Count) {
    Say "Repairing worktrees..."
    foreach ($w in $WorktreeRepairs) {
        Act "git -C $($w.Repo) worktree repair $($w.Paths -join ' ')"
        if (-not $DryRun) { git -C $w.Repo worktree repair @($w.Paths) 2>&1 | ForEach-Object { Say "    $_" } }
    }
    Say ""
}

# ---- 5. patch absolute paths ------------------------------------------------------------------
# Three spellings occur in the wild: D:\Workbench\FVTT\Repos\x, D:\\Workbench\\FVTT\\Repos\\x (JSON), D:/Workbench/FVTT/Repos/x
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
foreach ($k in $Moves.Keys) {
    $repo = if ($DryRun) { Join-Path $Repos $k } else { Join-Path $Suite $Moves[$k] }
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
    $ordered = $Moves.Keys | Sort-Object { $_.Length } -Descending
    Get-ChildItem -Path $projects -Directory | ForEach-Object {
        $name = $_.Name
        $new = $null
        if ($name -eq $encRepos) { $new = $encSuite }   # sessions rooted at the old umbrella folder
        else {
            foreach ($k in $ordered) {
                $prefix = "$encRepos-$k"
                if ($name -eq $prefix -or $name.StartsWith("$prefix-")) {
                    $new = "$encSuite-$($Moves[$k])" + $name.Substring($prefix.Length)
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
foreach ($k in $Moves.Keys) {
    $p = Join-Path $Suite $Moves[$k]
    $g = Join-Path $p '.git'
    if (-not (Test-Path $g)) { Say ("  {0,-34} {1}" -f $Moves[$k], 'present, not a git repo'); continue }
    $br = git -C $p rev-parse --abbrev-ref HEAD 2>$null
    $ok = if ($LASTEXITCODE -eq 0) { "ok, on $br" } else { 'GIT ERROR' }
    Say ("  {0,-34} {1}" -f $Moves[$k], $ok)
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
Say "  2. In it, run .\sync.ps1 -Status and check the MCP tools (foundry-*, artificer, scribe) come up"
Say "  3. Delete the *.bak-migrate files once happy"
