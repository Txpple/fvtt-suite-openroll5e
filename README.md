# Open Roll 5e suite

The umbrella for the **Open Roll 5e** family of Foundry VTT modules and the tools built around them
(the dnd5e MCP server, the Artificer and Session Scribe apps, the campaign repos).

This is a thin repo, not a monorepo. Each module keeps its own repository, history, releases and CI.
What lives here is the glue:

- `repos.json`: the manifest of every sibling repo, with kind, visibility and status.
- `sync.ps1`: clones missing siblings into this folder and fast-forwards clean ones. Never commits.
- `tools/integration-map.mjs`: scans the clones and writes `docs/integration-map.md`, the record of
  which module references which and the custom hooks they share.
- `CLAUDE.md`: the working notes for the family as a whole: conventions, release mechanics, loose ends.

## Layout

The sibling clones sit **inside** this folder and are gitignored:

```
<this repo>/
  CLAUDE.md  README.md  repos.json  sync.ps1  tools/  docs/
  fvtt-mod-battleflow/        <- its own git repo, ignored here
  fvtt-mod-fxstudio/          <- its own git repo, ignored here
  fvtt-mcp-dnd5e/             <- ...
  ...
```

Open a Claude Code session (or an editor) at this folder to work across the whole family; run git
inside a sibling to commit to it.

## Set up on a new machine

```powershell
git clone https://github.com/Txpple/fvtt-suite-openroll5e.git Repos
cd Repos
.\sync.ps1
```

`.\sync.ps1 -Status` reports every sibling's branch, dirty files and ahead/behind without changing
anything.
