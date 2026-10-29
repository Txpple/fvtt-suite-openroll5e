# Open Roll 5e suite (`fvtt-suite-openroll5e`)

The umbrella for the **Open Roll 5e** family: ten public Foundry VTT modules, three MCP servers and a private audio
library, each its own GitHub repo with its own history, releases and CI. This public repo is the thin layer over them;
this file holds the rules that span repos, each sibling's CLAUDE.md its own. The journal is `docs/log/YYYY-MM.md`.

**State (2026-10-29).** Prod (Echoes of Halruaa on Molten) runs By the Books 3.4.20 (Help's assist on the enemy is "Distracted (Help)", no longer "Helped"; 3.4.19 set an effect's
tone by its bend row; both released with no battery on the user's order and promoted to latest by hand; installed through
the installer, byte-identical), FX Studio 0.10.8 (a familiar's Help's two House FX; released without the installer, prod serving its files under 0.10.7's `module.json`), Errata 1.2.2, Combat Plus 1.7.2 (Confirm Reset Initiative), Token Art 1.0.2, Area Sounds 2.0.2, Autoexplore 1.1.2,
Loot Shelf 1.3.2, Open Server 1.4.1 (the jump to one's character and creatures from the Players list, its tooltip "Jump To Actor ..."; the landing scene removed), Party Stash 1.8.3, House Rules 1.1.0 (the arrow keys move tokens; going down costs a level of Exhaustion), Clue Board 1.0.0 (the party's
Mysteries; installed and enabled through the installer, the ten Session 02 documents migrated to Clues from their world
originals, the stash copies and the originals removed), each the latest release. The servers' latest releases are the MCP 4.6.5 (`set-landing-scene` retired with Open Server's landing scene; 4.6.4's `choices` refusal; `dist` built, live on a Claude Code restart), imagegen 1.3.2 (`dist` built, live on a
restart), Session Scribe 1.3.1. The sandbox (local Foundry 14.369, dnd5e 6.0.6, mirrored from prod on the 29th) runs prod's versions
and any `main` a module's live checks left (a deploy `--check` tells). No code waits unreleased on any `main`, and no branch but `main` stands anywhere (By the Books' `familiar-eyes`, superseded
by Open Server's jump, is gone). The
plan from `docs/reviews/2026-10-15-suite-review.md` was delivered on 2026-10-15; `HANDOFF.md` is retired, its §7 the
queue for the user.

## This repo and where it lives

- `repos.json`: the manifest (kind, visibility, status, `"kit"`, a public repo's `blurb`).
- `sync.ps1`: clones missing siblings, fast-forwards clean ones on `main`; never commits, pushes, stashes or switches.
- `tools/integration-map.mjs`: writes `docs/integration-map.md` (versions, references, hooks; the table to trust).
- `tools/suite-sections.mjs`: writes every "Part of Open Roll 5e" README section and this README's catalogue.
- `tools/upstream-watch.mjs`: the daily watch on Foundry and dnd5e releases (below).
- `tools/upstream-surface.mjs`: writes `watch/surface.json`, the upstream names and `patched` methods each repo ships.
- `tools/kit-sync.mjs`: keeps the kit's copies byte-identical with `templates/kit/`.
- `tools/build-module-zip.mjs`: builds and reads back a module's release zip (by hand, a dry run).
- `.github/workflows/release-module.yml`: the reusable release each module's `release.yml` calls.
- `tools/contracts.mjs`: each consumer's contract version against its emitter's.
- `tools/check-docs.mjs`: no date in a CLAUDE.md outside its State block (`--list` prints each).
- `tools/migrate-layout.ps1`: the old one-time move from the flat layout, kept for the record.
- Also `templates/` (below), `contracts/` (rules several modules write), `docs/reviews/` (dated family reviews),
  `docs/examples/session-scribe/` (two records from the public Greenrest campaign).

Generators and checks take `--check` (report, exit 1); `contracts` and `check-docs` take `--prefer <suffix>` to read
a worktree. **Not a monorepo:** the siblings are plain clones inside this folder, gitignored (`fvtt-*/`); nothing
builds or is shared here. The campaigns sit beside it in the FVTT repo parent (own committing `sync.ps1`, never
referenced by relative path). From a sibling: `../fvtt-mcp-dnd5e`, `../../fvtt-campaign-*`, and anything outside
the family (vendor snapshots, FX Studio's asset drops) three levels up. The servers run from each `fvtt-mcp-*/dist`
here, the dnd5e one registered twice (`foundry-halruaa5e`, PROD; `foundry-local5e`, the sandbox): moving this
folder means re-registering. A new machine: clone this repo into its FVTT repo parent, run `.\sync.ps1`, clone the
campaigns.

## Working here

- Open the session in **this folder** for work across modules (a rename, a shared hook, a README sweep, a release
  round), in the sibling for work inside one. Git is per sibling (`git -C <repo> status`); a `fvtt-*` path in
  this repo's own `git status` means its ignore is broken.
- **"Open issues"** means this suite's minus Errata: `gh issue list -R Txpple/<repo> --state open` for this repo and
  each active repo in turn, never an owner-wide `gh search issues`; Errata's only when asked for by name.
- **Worktrees beside the clones:** `git -C <repo> worktree add -b <branch> ../<repo>.<suffix> main`; the clone stays
  on `main`, the generators skip worktrees, and a merged branch goes, locally and on GitHub, with its worktree.
- **After a change that spans repos** (a module added, renamed or retired, a hook started or stopped, a kit or
  contract change): update `repos.json`; run `suite-sections`, `integration-map`, `upstream-surface`, `kit-sync`;
  commit what they rewrote in each repo, then here. **Green** is `suite-sections`, `upstream-surface`, `kit-sync`,
  `contracts` and `check-docs`, each with `--check`.

## The family

| Module (`Open Roll 5e: <Name>`, id = repo) | Does |
|---|---|
| `fvtt-mod-autoexplore` | a scene starts explored; tokens still need line of sight; no fog data written |
| `fvtt-mod-bythebooks` | the 2024 rules played from the sheet, each step with a receipt and a revert |
| `fvtt-mod-combatplus` | fight chores: music, initiative gate, defeated marking, alerts; GM Vision, Portrait View |
| `fvtt-mod-errata5e` | in-memory stopgap fixes for vendor bugs; the vendor-bug register |
| `fvtt-mod-fxstudio` | FX from what happened, through Sequencer, JB2A and PSFX; requires `sequencer` |
| `fvtt-mod-lootshelf` | loot chests and merchant shelves players use without owning them; receipts |
| `fvtt-mod-openserver` | hosted worlds: clears the startup pause; a jump to one's character and creatures from the Players list |
| `fvtt-mod-partystash` | a dnd5e Group's inventory as the party stash: moves, a coin dialog, receipts |
| `fvtt-mod-areasounds` | scene sound: one-shots, crossfaded loops, day and night, quiet in combat |
| `fvtt-mod-tokenart` | a token wears its state's look (ready, combat, dead), a file beside its base art |
| `fvtt-mod-clueboard` | the party's Mysteries: a Clue item type of its own, never carried; the DM collects, the record on the Group actor, a player's opening marks the read, the party's own mysteries to pin clues to (`docs/plans/clueboard.md`) |
| `fvtt-mod-houserules` | one table's always-on overrides, GM settings on by default, applied on every client; public, no blurb, so out of the catalogue |

- `fvtt-mcp-dnd5e` (public): the DM assistant, driving a live world on any host through Claude Code.
- `fvtt-mcp-imagegen` (public, key `imagegen`): Gemini art for Foundry.
- `fvtt-mcp-sessionscribe` (public, key `sessionscribe`): a Craig recording and the chat log to the session record.
- `fvtt-mod-areasounds-sfx` (private): the audio library Area Sounds ships from; not a module.
- Campaigns: `fvtt-campaign-echoesofhalruaa` (current, private, `"parent": true`); `fvtt-campaign-greenrest`
  (concluded, public, a reference clone outside `repos.json`). Retired: `fvtt-mod-battleflow` (now By the Books),
  `fvtt-mod-vendorfixes` (now Errata), `fvtt-mod-miscpatches`.

## How they fit together

- **Every module installs and works alone:** cross-module behaviour is detection, `game.modules.get(id)?.active`,
  never `requires`; the modules' one hard dependency is FX Studio's on `sequencer`.
- **One client acts:** a consequence every client hears lands on the elect (Foundry's active GM; the kit's `elect.js`
  adds the leading window). A table may run several GM clients, Gamemaster or Assistant (suite issue #8).
- **By the Books is the hub:** it emits `bythebooks.moment` and six narrower hooks (the map lists them). FX Studio
  plays the moment (once per `momentId` and word; a 2.x table's `battleflow.moment` too) and emits
  `fxstudio.rebuilt`. Session Scribe reads its cards (scope `fvtt-mod-bythebooks`, per card falling back to
  `fvtt-mod-battleflow`). A companion leaving the table drops its gear as a Loot Shelf chest when Loot Shelf is on.
- **Loot Shelf and Party Stash pair through the kit, not detection:** both carry `receipt.js` (the same three receipt
  modes, set in each); Party Stash posts nothing for a change with the kit's echo marker, which every Loot Shelf
  write carries; Loot Shelf offers any dnd5e Group the actor belongs to for loot and sale coin.
- **Token class patches at `setup`:** Combat Plus's GM Vision (its switch, GM clients, not beside the upstream
  `gm-vision`) wraps `CONFIG.Token.objectClass`; Loot Shelf patches `_canView`; Combat Plus's Portrait View patches
  `_canView` and `_onClickLeft2`, stepping aside for Loot Shelf's tokens. Each defers to the one beneath (any
  order works); a class replaced after `setup` drops them all.
- **The MCP writes one module's data**, Area Sounds' sets (Open Server's landing-scene flag went with Open Server
  1.4.0 and the MCP's `set-landing-scene`), and `get-world-info` names By the Books (and its old id), Area Sounds
  and Open Server (`src/page/`): a rename needs the same edit there.
- **House Rules writes into By the Books' receipts without knowing them:** its going-down rule adds a level of
  Exhaustion inside the Hit Point write that lands on 0 (`preUpdateActor`, the updating client, unless that write sets
  Exhaustion itself); By the Books' damage receipt snapshots Exhaustion either side of `applyDamage`, shows the change
  and restores the recorded prior level on every Revert, so the revert is never charged. Neither detects the other; a
  table's house rule belongs in House Rules, never as a setting in a rules module.
- **Token Art reads the others' signals and needs none** (hit points, the `dead` status, the combat
  tracker); another image write (By the Books' transforms, the MCP's `set-actor-art`) becomes the token's base. It
  emits `tokenart.changed`; nothing listens yet.
- **Contracts:** an emitter owns `contracts/<name>.json` with a version (By the Books' `moment.json` and
  `card-flags.json`, Area Sounds' `sets.json`); a consumer tests against it from the clone beside it, skips when
  absent, and names the version in its `contracts/consumes.json`. A rule several modules write is one file here
  (`contracts/dead.md`). **Hooks:** `<short>.<event>` belongs to `fvtt-mod-<short>`; the emitter documents it in its
  README and contract, and every listener tolerates it never firing.

## Upstream upgrades

A Foundry or dnd5e release can break a module (14.367 and 14.369 each reshaped `/join` and hung the bridge). The daily
`upstream-watch.mjs --notify` opens an `upgrade review` issue per release newer than `VERSIONS.md`'s Reviewed, a row
per public repo with its leads (places to look, not verdicts).
**The review** is a session here: judge each row (`no impact`, `breaks: …`, `adopt: …`, linking the sibling issue)
and tick it; the MCP's row needs the new build's `/join` fixture in its tests and an `npm run smoke:bridge` line
from the updated sandbox, Errata's is its own version review. Then set Reviewed and Reviewed on and commit; the next
run closes the issue once every row is ticked.

## Conventions

- **Names:** `fvtt-<kind>-<name>` (`mod`, `mcp`, `campaign`, `suite`; no hyphen in the name). Public text says "part
  of Open Roll 5e" and "companions", never "sister" or "sibling". Check a new title against the list a setup screen
  installs from (a `getPackages` post to `/setup`). A rename moves the flag scope: the module carries a read fallback
  and a GM-load migration (Area Sounds' `store.js`, By the Books' `migrate.js`).
- **Branches:** `main` everywhere, nothing else long-lived. **Contributions:** issues, never pull requests. **State
  blocks and the log** (the last section) hold for every sibling's CLAUDE.md too.
- **Releases:** only on the user's word; a patch by default, a minor when the user names one. One GitHub release per
  version, with the zip and a bare `module.json` (worlds install from `releases/latest/download/module.json`). Loot
  Shelf, Party Stash, Autoexplore and Open Server release from an annotated tag through `release-module.yml` (a
  pre-release suffix is never latest; a dispatch is a dry run). By the Books' own `release.yml` wants its tag body to
  name its battery (`Battery: <run> — n/n suites, n/n checks, GREEN`, from `battery-status.mjs --line`; a full
  run red by one to three suites is run again, and a second run red on different suites, each green alone, is the
  two-run line, `--line <A> --and <B> --one-offs <C>`) or say `Battery: none (pre-release)`. Errata and FX Studio run `build-release.ps1`; the rest release by hand.
- **README sections:** "Part of Open Roll 5e", between `<!-- openroll5e:family -->` markers, is never hand-edited.
- **Compatibility:** verified on Foundry 14, minimums 11 to 14; the system, where declared, dnd5e (a local source
  checkout answers its questions). **Tooling:** Biome and Vitest in By the Books, Token Art, Loot Shelf,
  Party Stash and the servers; Errata's register check, FX Studio's `check-*.mjs`, Area Sounds' `test`, plain
  `scripts/` elsewhere; a module growing tooling takes the template's.
- **The kit** (small, pulled by need): `templates/kit/` (`elect.js`, `receipt.js`, `log.js`, their tests) is the
  source, copied to `scripts/kit/` and `tests/kit/` in each `"kit": true` repo and `templates/module/`; never edit a
  copy. **The template** (`templates/module/`): Biome, Vitest, `verify.yml`, a `release.yml` on the reusable
  workflow, the kit and `lang/en.json`. No language but English is planned: a module moves its strings to
  `lang/en.json` when it adopts the template (By the Books never).

## The sandbox and prod

- **The sandbox** (`foundry-local5e`) is the development machine's local Foundry, a copy of prod, never prod; the
  hosted worlds are reached through the MCP, never raw file edits. **One GM seat, shared between sessions:** before
  a `local-foundry.mjs restart`, a `register-module.mjs` run or a long bridge walk, ask any linked session on
  `foundry-local5e` to pause. A seat blocking a suite is a bridge, never a person (`disconnect-bridge`;
  `{ "all": true }` for other sessions' recorded browsers).
- **Every MCP page is a GM client** running every active module, so a module disabled through the bridge runs once
  more there; a GM page script in `configure-modules.mjs`'s pattern, console captured, walks a module without a
  browser login. Each write leaves a receipt under the OS temp dir (`fvtt-mcp-dnd5e/receipts/`); the lock is per
  page, so two sessions on one bridge user interleave. `sessionscribe` joins as the bridge user.
- **Poll for a state, never sleep a beat.** A mirror (`pull-prod-to-local.mjs`, both bridges off) replaces the
  sandbox's world and dev copies: redeploy after. **Client settings don't mirror:** each browser keeps its own (chat
  cards follow dnd5e's Chat Log Theme; the user's choice is Light).
- **Prod**, only on the user's word, from the MCP repo with the gitignored `.env.halruaa` and `FOUNDRY_HOST=molten
  FVTT_MCP_ENV=.env.halruaa` in the process env. `deploy-house-module.mjs <repo>` serves new files (live on reload;
  the version shown changes when the process boots). The installer, `register-module.mjs --id <repo> --manifest <the
  release's module.json>`, returns the world to setup, installs the published release and relaunches, disconnecting
  everyone (`list-users` first); never a pre-release. A new module: the installer, `configure-modules.mjs --enable`,
  the installer again as the bounce. A launch answering "could not be processed" may be up: read `/api/status`
  before a retry. Retiring: `--disable`, then `uninstall-modules.mjs`. A module setting is written by a bridge
  script in `configure-modules.mjs`'s pattern (`run-script` fences `game` off). Never `game.shutDown()` via the bridge.

## Keep this file current

A CLAUDE.md keeps its rules and at most one `**State (YYYY-MM-DD).**` block, opening in its first 30 lines and
running to the first blank line, rewritten in place when its facts change; no other date appears in it. When
something that spans modules changes (a sibling, a rename, a shared hook, a release convention), write the rule here
or in `repos.json` in the same session and put what happened under its date in `docs/log/YYYY-MM.md`; release detail
goes to the repo's CHANGELOG or release notes. Regenerate generated files rather than editing them.
