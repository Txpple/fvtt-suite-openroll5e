# sync.ps1 - bring the sibling clones listed in repos.json up to date.
#
#   .\sync.ps1            clone anything missing, fast-forward clean clones on main
#   .\sync.ps1 -Status    report only: branch, dirty files, ahead/behind; change nothing
#   .\sync.ps1 -NoClone   skip the clone step (just fast-forward what is here)
#
# This script NEVER commits, pushes, stashes or switches branches. A clone that is dirty, on a
# branch other than main, or ahead of origin is named and left exactly as it is. The campaign
# repos have their own sync.ps1 that commits via session hooks; this one only fast-forwards them.
#
# Worktrees (a .git *file* rather than a directory, e.g. fvtt-mod-battleflow-cover) are reported
# and skipped. Folders matching fvtt-* that are not in repos.json are reported as strays.
#
# Best-effort: offline just means "sync later". Exit code is 0 unless repos.json is unreadable.
[CmdletBinding()]
param(
    [switch]$Status,
    [switch]$NoClone
)
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
$manifestPath = Join-Path $root 'repos.json'
if (-not (Test-Path $manifestPath)) { Write-Error "sync: repos.json not found next to sync.ps1"; exit 1 }
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$owner = $manifest.owner

$seen = @{}
foreach ($r in $manifest.repos) {
    $name = $r.name
    $seen[$name] = $true
    $path = Join-Path $root $name
    $git = Join-Path $path '.git'

    if (-not (Test-Path $path)) {
        if ($r.status -ne 'active' -or -not $r.sync) {
            Write-Output ("{0,-34} {1}" -f $name, "absent ($($r.status); not synced)")
            continue
        }
        if ($Status -or $NoClone) {
            Write-Output ("{0,-34} {1}" -f $name, "absent (would clone)")
            continue
        }
        Write-Output ("{0,-34} {1}" -f $name, "cloning...")
        git clone --quiet "https://github.com/$owner/$name.git" $path
        if ($LASTEXITCODE -ne 0) { Write-Output ("{0,-34} {1}" -f $name, "CLONE FAILED (offline, or no access to $owner/$name)") }
        continue
    }

    if (-not (Test-Path $git)) {
        Write-Output ("{0,-34} {1}" -f $name, "present but not a git repo; skipped")
        continue
    }
    if ((Get-Item $git -Force) -is [System.IO.FileInfo]) {
        $wtBranch = git -C $path rev-parse --abbrev-ref HEAD
        Write-Output ("{0,-34} {1}" -f $name, "worktree on '$wtBranch'; left alone")
        continue
    }

    if (-not $r.sync) {
        Write-Output ("{0,-34} {1}" -f $name, "present ($($r.status); not synced)")
        continue
    }

    git -C $path fetch --quiet 2>$null
    $fetched = ($LASTEXITCODE -eq 0)
    $branch = git -C $path rev-parse --abbrev-ref HEAD
    $dirty = @(git -C $path status --porcelain).Count
    $counts = git -C $path rev-list --left-right --count 'HEAD...@{u}' 2>$null
    $ahead = 0; $behind = 0
    if ($counts) { $parts = $counts -split '\s+'; $ahead = [int]$parts[0]; $behind = [int]$parts[1] }

    $state = "$branch"
    if ($dirty) { $state += ", $dirty dirty" }
    if ($ahead) { $state += ", ahead $ahead" }
    if ($behind) { $state += ", behind $behind" }
    if (-not $fetched) { $state += ", fetch failed" }

    if ($Status) {
        Write-Output ("{0,-34} {1}" -f $name, $state)
        continue
    }

    if ($branch -ne 'main') {
        Write-Output ("{0,-34} {1}" -f $name, "$state; not on main, left alone")
    } elseif ($dirty) {
        Write-Output ("{0,-34} {1}" -f $name, "$state; dirty, left alone")
    } elseif ($behind -gt 0 -and $ahead -eq 0) {
        git -C $path pull --quiet --ff-only 2>$null
        if ($LASTEXITCODE -eq 0) { Write-Output ("{0,-34} {1}" -f $name, "fast-forwarded $behind commit(s)") }
        else { Write-Output ("{0,-34} {1}" -f $name, "$state; fast-forward failed, left alone") }
    } elseif ($behind -gt 0) {
        Write-Output ("{0,-34} {1}" -f $name, "$state; diverged, left alone")
    } else {
        Write-Output ("{0,-34} {1}" -f $name, $state)
    }
}

# Strays: fvtt-* folders here that repos.json does not know about. A worktree of a listed repo
# (its .git is a file) is expected and only reported; anything else is flagged.
Get-ChildItem -Path $root -Directory -Filter 'fvtt-*' | ForEach-Object {
    if ($seen.ContainsKey($_.Name)) { return }
    $g = Join-Path $_.FullName '.git'
    if ((Test-Path $g) -and ((Get-Item $g -Force) -is [System.IO.FileInfo])) {
        $wtBranch = git -C $_.FullName rev-parse --abbrev-ref HEAD
        Write-Output ("{0,-34} {1}" -f $_.Name, "worktree on '$wtBranch'; left alone")
    } else {
        Write-Output ("{0,-34} {1}" -f $_.Name, "STRAY: not in repos.json")
    }
}
exit 0
