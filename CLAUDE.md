# Open Roll 5e suite (`fvtt-suite-openroll5e`)

## What this is

The umbrella for the **Open Roll 5e** family: nine public Foundry VTT modules, the dnd5e MCP server,
two apps, the campaign repos and a private asset library. Every one of those is its own GitHub repo
with its own history, releases and CI, and that stays true. This repo is the thin layer over them:

- `repos.json`: the manifest. Every sibling, its kind, visibility and status.
- `sync.ps1`: clones missing siblings into this folder and fast-forwards clean ones on `main`.
  `-Status` only reports. It never commits, pushes, stashes or switches branches.
- `tools/integration-map.mjs`: writes `docs/integration-map.md` from the clones.
- this file: what spans repos. Each sibling's own CLAUDE.md is authoritative inside it.

**Not a monorepo.** Nothing builds here, no code is shared through here, and the sibling repos
are not submodules. They are ordinary clones that happen to live in this folder, ignored by this
repo's `.gitignore` (`fvtt-*/`). The point is one working directory that sees the whole family.

## Where it lives

- **desktop-ny:** `D:\Workbench\FVTT\Repos`. The folder predates this repo and keeps its name:
  the MCP servers in `~\.claude.json` run from `fvtt-mcp-dnd5e/dist`, `fvtt-app-artificer/dist`
  and `fvtt-app-sessionscribe/dist` under this path, the campaign sync hooks resolve from it, and
  `fvtt-mod-battleflow-cover` is a git worktree with absolute paths. Renaming the folder breaks all
  of those; don't.
- **Other machines:** clone this repo to wherever that machine keeps its FVTT repos (the machine's
  `local-*` CLAUDE.md says where), then run `.\sync.ps1`.

## Working here

- Open the Claude Code session with **this folder** as the working directory when the work crosses
  modules (a rename, a shared hook, a sister-modules README sweep, a release round). Open the
  sibling itself for work inside one module; its CLAUDE.md, tests and tools are written for that.
- Git is per sibling: `git -C fvtt-mod-fxstudio status`, and so on. Commits in this repo are for
  the files this repo tracks. If a `fvtt-*` path ever appears in `git status` here, the ignore is
  broken; fix that before committing.
- `fvtt-mod-battleflow-cover` is a worktree of Battle Flow on `feat/cover-hover`, not a clone.
  `fvtt-mod-battleflow/.claude/worktrees/` may hold more. `sync.ps1` and the map generator skip
  worktrees.
- After adding, renaming or retiring a module: update `repos.json`, rerun
  `node tools/integration-map.mjs`, sweep the nine "Sister modules" README sections (below), and
  commit the result here.

## The family

Snapshot 2026-10-07. Versions and compatibility are in `docs/integration-map.md`, regenerated from
the manifests; the table there is the one to trust.

**Modules** (public, Foundry title `Open Roll 5e: <Name>`, package id = repo name):

| Repo | Title | Does |
|---|---|---|
| `fvtt-mod-autoexplore` | Autoexplore | Scene starts fully explored; tokens still need line of sight; no fog data written |
| `fvtt-mod-battleflow` | Battle Flow | Combat automation for dnd5e 2024: auto damage on hit, reaction holds, auto saves, concentration |
| `fvtt-mod-combatplus` | Combat Plus | Fight chores: combat music, initiative gate, out-of-turn movement block, defeated marking, turn alerts |
| `fvtt-mod-errata5e` | Errata | In-memory stopgap fixes for vendor bugs (premium 2024 books, dnd5e, Foundry); the vendor-bug register |
| `fvtt-mod-fxstudio` | FX Studio | Visual and sound FX from what happened at the table, via Sequencer + JB2A + PSFX; requires `sequencer` |
| `fvtt-mod-lootshelf` | Loot Shelf | Loot chests and merchant shelves players use without owning them; chat receipts |
| `fvtt-mod-openserver` | Open Server | Hosted worlds: clears the startup pause, per-user landing scenes |
| `fvtt-mod-partystash` | Party Stash | A dnd5e Group actor's inventory as a working party stash: moves not copies, coin dialog, receipts |
| `fvtt-mod-soundscape` | Soundscape | Scene background sound: one-shots with silence, crossfaded loops, day/night gating, quiet in combat |

**Tools and apps:**

- `fvtt-mcp-dnd5e` (public): the DM-assistant MCP server; drives any live Foundry world (Molten
  Hosting, a local install, a URL) through Claude Code. Formerly `fvtt-mcp-molten5e`.
- `fvtt-app-artificer` (public): Gemini image generation for Foundry art. Formerly `fvtt-mcp-artificer`.
- `fvtt-app-sessionscribe` (public): Craig recording + Foundry chat log to session record; home of
  the `session-scribe` skill.
- `fvtt-mod-soundscape-sfx` (private): the audio library Soundscape ships from. Not a module.

**Campaigns** (private): `fvtt-campaign-echoesofhalruaa` is the current campaign (scaffolded
2026-09-27 as `fvtt-campaign-next`; it has its own committing `sync.ps1` on session hooks).
`fvtt-campaign-greenrest` is concluded and archived read-only on GitHub (2026-10-01).

**Retired:** `fvtt-mod-vendorfixes` (replaced by Errata; archived, private, not cloned here) and
`fvtt-mod-miscpatches` (retired 2026-09-25; the GitHub repo no longer resolves, a clone may still be
on disk; the Open Roll 5e README sections stopped listing it).

## How they fit together

The full picture is `docs/integration-map.md`. The shape of it:

- **Every module installs and works alone.** The "Sister modules" section in each README promises
  that ("each installs and works on its own and none needs another"). Cross-module behaviour is
  detection, `game.modules.get(id)?.active`, never a `requires` relationship. The only hard
  dependency in the family is FX Studio on the third-party `sequencer`.
- **Battle Flow is the hub.** It emits `battleflow.moment` (plus `armorBlock`, `styleDice`,
  `holdOpened`, `castReleased`, `areaAskAnswered`, `deferredUsageCard`). FX Studio listens to
  `battleflow.moment` through `scripts/readers/battleflow.js` to play effects from what happened,
  and emits `fxstudio.rebuilt`. Session Scribe reads Battle Flow's chat cards when building a
  session record.
- **Loot Shelf knows Party Stash** (receipt settings line up when both are present).
- **The MCP writes into two modules' data.** `src/page/scenes.ts` sets Open Server's landing-scene
  flag and `src/page/soundscape.ts` authors Soundscape's per-scene sound sets (flags only). Its
  `scratch/siblings-census.mjs` lists every module id. When a module is renamed or retired, those
  need the same edit.
- **Hook naming is the contract:** a hook `<short>.<event>` belongs to the module whose id is
  `fvtt-mod-<short>`. Add new hooks in the emitting module, document them in its README, and make
  every listener tolerate the hook never firing.

## Conventions

- **Names.** Repo `fvtt-<kind>-<name>` with kind `mod`, `mcp`, `app`, `campaign`, `suite`; the
  name part has no hyphens. Package id = repo name. Foundry title `Open Roll 5e: <Name>`. The
  2026-10-02 rename round is complete, Battle Flow included (its manifest and all nine README
  sections say `Open Roll 5e: Battle Flow`).
- **Branches.** `main` everywhere, nothing else long-lived. Feature work in a branch or worktree.
- **Releases.** One GitHub release per module version. The manifest URL every world installs from
  is `https://github.com/Txpple/<repo>/releases/latest/download/module.json` and the download is
  `.../releases/download/v<version>/<repo>.zip`, so a release must carry both assets. Battle Flow
  has `release.yml` + `verify.yml`; Errata has `check.yml` + `upstream-watch.yml`; the MCP and
  Session Scribe have `ci.yml`. The other modules release by hand.
- **"Sister modules" README sections.** All nine public module READMEs carry one, each listing the
  other eight with the same one-line descriptions. Adding, renaming or retiring a module is a
  nine-file edit; keep the lines identical across repos.
- **Foundry compatibility.** All verified on 14; minimums range 11 to 14 (Battle Flow and FX Studio
  are 14-only). The system, where declared, is dnd5e. The local reference checkout of dnd5e source
  on desktop-ny is `D:\Workbench\LOCAL\Repos\dnd5e-release-5.3.3`.
- **Tooling tiers.** Battle Flow, the MCP and both apps have Biome + TypeScript config + Vitest;
  Errata has its register check; FX Studio, Loot Shelf, Party Stash and Soundscape have a
  package.json with tools but no linter or tests; Autoexplore, Combat Plus and Open Server are a
  `module.json` plus `scripts/`. When a small module grows tooling, copy Battle Flow's Biome config
  rather than inventing a new one.
- **Testing host.** desktop-ny runs the local Foundry (14.368.0, dnd5e 6.0.5); the worlds in play
  are on Molten Hosting and reached through the MCP. Prefer the MCP over raw file edits for world
  data.

## Loose ends (2026-10-08)
  successor and the setting keys moved with it.
- The MCP's siblings census still names `fvtt-mod-miscpatches`.
- The local Foundry install on desktop-ny still carries pre-rename copies of the modules and
  `fvtt-mod-vendorfixes`; update or remove next time in Foundry.
- `fvtt-mod-miscpatches` is still cloned on desktop-ny with no remote to push to; delete when sure.

## Keep this file current

Same rule as the machine repos: when something changes that spans modules (a new sibling, a
rename, a shared hook, a release convention), record it here or in `repos.json` in the same
session. Regenerate the map rather than editing it.
