# Open Roll 5e suite

The umbrella for the **Open Roll 5e** family of Foundry VTT modules and the MCP servers built around
them (the dnd5e DM assistant, image generation, the session scribe).

This is a thin repo, not a monorepo. Each module and server keeps its own repository, history,
releases and CI. What lives here is the glue:

- `repos.json`: the manifest of every sibling repo, with kind, visibility and status.
- `sync.ps1`: clones missing siblings into this folder and fast-forwards clean ones. Never commits.
- `tools/integration-map.mjs`: scans the clones and writes `docs/integration-map.md`, the record of
  which repo references which and the custom hooks they share.
- `CLAUDE.md`: the working notes for the family as a whole: conventions, release mechanics, loose ends.
- `tools/migrate-layout.ps1`: the one-time move from the old flat layout to this one (see below).

## Layout

The sibling clones sit **inside** this folder and are gitignored. The campaign repos (content, not
code) sit **next to** it, in the parent folder:

```
D:\Workbench\FVTT\Repos\
  fvtt-suite-openroll5e\          <- this repo
    CLAUDE.md  README.md  repos.json  sync.ps1  tools\  docs\
    fvtt-mod-battleflow\          <- its own git repo, ignored here
    fvtt-mod-fxstudio\            <- its own git repo, ignored here
    fvtt-mcp-dnd5e\
    fvtt-mcp-imagegen\
    fvtt-mcp-sessionscribe\
    ...
  fvtt-campaign-echoesofhalruaa\  <- above the suite, listed in repos.json with "parent": true
  fvtt-campaign-greenrest\
```

Open a Claude Code session (or an editor) at the suite folder to work across the whole family; run
git inside a sibling to commit to it.

## Set up on a new machine

```powershell
cd D:\Workbench\FVTT\Repos
git clone https://github.com/Txpple/fvtt-suite-openroll5e.git
cd fvtt-suite-openroll5e
.\sync.ps1
```

`.\sync.ps1 -Status` reports every sibling's branch, dirty files and ahead/behind without changing
anything.

## Moving a machine from the old flat layout

Until 2026-10-08 the clones sat directly in `D:\Workbench\FVTT\Repos\` and that folder was the
suite repo. `tools\migrate-layout.ps1` moves everything into the layout above, repairs git
worktrees, patches the absolute paths in `~\.claude.json` and per-repo local config, and renames
the Claude Code project folders so session history follows. Run it from your own PowerShell with
the Claude desktop app closed; `-DryRun` prints the plan first.
