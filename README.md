# Open Roll 5e

Run D&D 2024 on [Foundry VTT](https://foundryvtt.com) with one automation module instead of a
stack. If you want one, add an assistant that was there last session.

**One module instead of a stack.** [Battle Flow](https://github.com/Txpple/fvtt-mod-battleflow)
automates combat under the 2024 rules: a hit rolls and applies its own damage, saves resolve
themselves, reactions hold, concentration is tracked. It is one module with no dependencies beyond
the dnd5e system, every feature is always on, and it covers the official 2024 books, the premium
ones included, because [Errata](https://github.com/Txpple/fvtt-mod-errata5e) holds each vendor bug
until the vendor ships its own fix. Eight more modules cover the rest of the table, from the fog of
war to the loot, and every one installs and works on its own.

| | Open Roll 5e | the midi-qol stack |
| --- | --- | --- |
| Install | one module | midi + DAE + premades + their dependencies |
| Settings | ten | hundreds |
| Coverage | the official 2024 books | nearly everything, if you set it up |
| Surviving a dnd5e update | public hooks only, nothing patched | waits for each module to catch up |

**An assistant that was there last session, if you want one.** The modules contain no AI and need
none. The three MCP servers are a separate, optional layer that puts Claude at the DM's side,
working only on your own world and your own sessions. One builds content in a live world, a stat
block becoming a complete NPC and a map image a walled and lit scene, with nothing installed in the
world, so it reaches a hosted box as easily as a local one. One,
[Session Scribe](https://github.com/Txpple/fvtt-mcp-sessionscribe), turns the session's recording
and chat log into its record: a player recap, the combat report, GM notes and a party snapshot. The
record goes into the campaign's own repository, and the next session's prep reads it. The third
makes art for your own table. Two complete records are in
[docs/examples/session-scribe](docs/examples/session-scribe); the campaign they came from is public
at [fvtt-campaign-greenrest](https://github.com/Txpple/fvtt-campaign-greenrest).

**Everything it does, you can see and revert.** Every automatic action in combat, every trade at a
shelf and every transfer from the stash posts a receipt with a one-click revert.

Built for one table and shared.

This repository is the umbrella. It holds the manifest of the family, the map of how its members
fit together, and a script that lays the clones out in one working directory. Nothing builds here
and no code is shared through here: each module and server is its own repository with its own
history, releases and CI.

<!-- openroll5e:catalogue -->
## The modules

| Module | Does |
| --- | --- |
| [Open Roll 5e: Autoexplore](https://github.com/Txpple/fvtt-mod-autoexplore) | Lets a scene start fully explored, so the whole map shows through the fog of war while tokens still need line of sight. |
| [Open Roll 5e: Battle Flow](https://github.com/Txpple/fvtt-mod-battleflow) | Combat automation for dnd5e 2024 rules: a hit rolls and applies its own damage, saves resolve themselves, reactions hold, and concentration is tracked. Every rule that touches a fight in the 2024 core books, Heroes of Faerûn, Arcana Unleashed and Ravenloft: The Horrors Within. |
| [Open Roll 5e: Combat Plus](https://github.com/Txpple/fvtt-mod-combatplus) | Automates the chores of running a fight: combat music, an initiative gate, an out-of-turn movement block, defeated marking at 0 HP and turn alerts. |
| [Open Roll 5e: Errata](https://github.com/Txpple/fvtt-mod-errata5e) | Corrects, in memory, bugs in the premium D&D 2024 books, the dnd5e system and Foundry itself, each fix held until the vendor ships its own. |
| [Open Roll 5e: FX Studio](https://github.com/Txpple/fvtt-mod-fxstudio) | Visual and sound effects for dnd5e, played from what actually happened at the table, with about a thousand stock FX and a window for authoring your own. |
| [Open Roll 5e: Loot Shelf](https://github.com/Txpple/fvtt-mod-lootshelf) | Loot chests and merchant shelves that players can take from, buy from and sell to without owning them, with a receipt for every trade. |
| [Open Roll 5e: Open Server](https://github.com/Txpple/fvtt-mod-openserver) | For hosted worlds: clears the startup pause so players can play before the GM arrives, and gives any user a landing scene of their own. |
| [Open Roll 5e: Party Stash](https://github.com/Txpple/fvtt-mod-partystash) | Makes a dnd5e Group actor's inventory a working party stash: drags move instead of copying, coin moves through a dialog, and every transfer posts a receipt. |
| [Open Roll 5e: Area Sounds](https://github.com/Txpple/fvtt-mod-areasounds) | Background sound for scenes: random one-shots with silence between them, seamless crossfaded loops, day and night gating, and quiet during combat. |

## The MCP servers

- [fvtt-mcp-dnd5e](https://github.com/Txpple/fvtt-mcp-dnd5e): builds D&D 5e content in a live Foundry world from Claude Code: a stat block becomes a complete NPC, a map image a walled and lit scene, an adventure its journals, tables and handouts.
- [fvtt-mcp-imagegen](https://github.com/Txpple/fvtt-mcp-imagegen): makes the art with Google's Gemini image models: icons, tokens, props, portraits and illustrations, token redresses and restyles, battlemap and overland-map repaints, and the illustrated session records, all grounded in what the world already shows.
- [fvtt-mcp-sessionscribe](https://github.com/Txpple/fvtt-mcp-sessionscribe): turns a session's Discord recording and Foundry chat log into its record. Its end-to-end `session-scribe` skill drives the server from the Craig link to a speaker-labelled transcript, a fully illustrated player recap, combat statistics, GM notes and a party snapshot.
<!-- /openroll5e:catalogue -->

Install any module by pasting its manifest URL into Foundry's *Install Module* dialog; the pattern
is the same for all nine:

```
https://github.com/Txpple/<repo>/releases/latest/download/module.json
```

Each README states its own Foundry and system requirements, and
[docs/integration-map.md](docs/integration-map.md), regenerated from the manifests, is the table to
trust for versions and compatibility. The servers are set up from their own READMEs and run under
Claude Code. Two complete session records the scribe produced, recap, combat report and GM notes
with the illustrations, are in [docs/examples/session-scribe](docs/examples/session-scribe).

## How they fit together

- **Every module works alone.** Cross-module behaviour is detection, `game.modules.get(id)?.active`,
  never a `requires` relationship. The only hard dependency in the family is FX Studio on the
  third-party Sequencer module.
- **Battle Flow is the hub.** It emits `battleflow.moment` and a handful of narrower hooks. FX
  Studio listens to them to play effects from what happened, and Session Scribe reads Battle Flow's
  chat cards for the combat report.
- **Loot Shelf and Party Stash are companions.** One owns loot on the ground and goods for sale,
  the other the party's shared inventory, and their receipt settings line up when both are present.
- **The dnd5e server writes into two modules' data:** Open Server's landing-scene flag and
  Area Sounds' per-scene sound sets, flags only.
- **A hook is named after its module.** `<short>.<event>` belongs to the module whose id is
  `fvtt-mod-<short>`. New hooks are added in the emitting module, and every listener tolerates the
  hook never firing.

The generated [integration map](docs/integration-map.md) lists who references whom and which hooks
cross repo lines.

## This repository

```
repos.json                 the manifest: every repo, its kind, visibility, status and one-line blurb
sync.ps1                   clones the missing repos into this folder and fast-forwards clean ones
tools/integration-map.mjs  writes docs/integration-map.md from the clones
tools/suite-sections.mjs   writes the "Part of Open Roll 5e" section of every README from repos.json
tools/migrate-layout.ps1   the one-time move from the flat layout used until 2026-10-08
docs/integration-map.md    the generated map
CLAUDE.md                  working notes for sessions that span the family
```

The clones sit inside this folder and are gitignored (`fvtt-*/`), so one working directory
sees the whole family while every repo keeps its own git:

```
<your repos folder>/
  fvtt-suite-openroll5e/        this repo
    fvtt-mod-battleflow/        its own clone, ignored here
    fvtt-mod-fxstudio/          ...
    fvtt-mcp-dnd5e/
    ...
```

To set it up:

```powershell
git clone https://github.com/Txpple/fvtt-suite-openroll5e.git
cd fvtt-suite-openroll5e
.\sync.ps1
```

`sync.ps1` clones what is missing and fast-forwards clean clones on `main`. It never commits,
pushes, stashes or switches branches: a clone that is dirty, on another branch or ahead of origin
is named and left alone, and a repo you cannot reach is reported and left for later. `-Status`
only reports and `-NoClone` skips the clone step. A few entries in `repos.json` are private (the
audio library Area Sounds ships from, and the campaign repos, which live next to the suite rather
than in it); without access they simply fail to clone.

After adding, renaming or retiring a repo: edit `repos.json`, run `node tools/suite-sections.mjs`
and `node tools/integration-map.mjs`, and commit the READMEs the first one rewrote in their own
repos.

## Conventions

- **Names.** Repo `fvtt-<kind>-<name>` with kind `mod`, `mcp`, `campaign` or `suite`. A module's
  package id is its repo name and its Foundry title is `Open Roll 5e: <Name>`.
- **Releases.** One GitHub release per module version, carrying both `module.json` and
  `<repo>.zip`, so the `releases/latest` manifest URL always resolves.
- **Branches.** `main` everywhere; feature work in a branch or worktree.

## License

MIT. See [LICENSE](LICENSE). Each module and server carries its own license file.
