# Open Roll 5e suite (`fvtt-suite-openroll5e`)

The umbrella for the **Open Roll 5e** family: ten public Foundry VTT modules, three MCP servers and a private audio
library, each its own GitHub repo with its own history, releases and CI. This public repo is the thin layer over them;
this file holds the rules that span repos, each sibling's CLAUDE.md its own. The journal is `docs/log/YYYY-MM.md`.

**State (2026-11-09).** Prod (Echoes of Halruaa) moved on the 31st from Molten to the self-hosted box, a
byte-identical copy (no change on Molten since), the MCP and Session Scribe repointed (`.env.prod`, doctor green on
both; this machine only, the other machines' registrations still name Molten). Prod runs By the Books 3.4.25 (every part of a roll says where it came from: dnd5e's parts named on every d20 test and damage roll, "Dex", Proficiency, Expertise, Alert, Exhaustion, the module's own riders and an effect's bonus by name; the Fighting Styles that switch on the bar, green or red; a feat that lost its pack effect read off the PHB original, Kartor's Dueling +2 back with his data untouched; `Battery: 2026-11-05T17-53-32 — 69/69 suites, 2401/2401 checks, GREEN`; installed through the installer, 159/159 served files byte-identical; 3.4.24 free casts, then slots; 3.4.23 Session 03's table fixes), FX Studio 0.10.10 (pictures held inside a Foundry 14 scene level: Sequencer 4.3 draws only what is on the viewed
level, so Misty Step's mist and some 370 FX at elevation 999 or below the floor never showed on a scene with a
level; installed through the installer, 56/56 served files byte-identical; 0.10.9 Dark One's Blessing in Fiendish
Vigor's look, Inspiring Smite on the gift, Sacred Weapon in Heroism's), Errata 1.2.2, Combat Plus 1.7.2 (Confirm Reset Initiative), Token Art 1.0.3 (the five open issues; a world's art folders listed once, no 404 per look), Area Sounds 2.0.2, Autoexplore 1.1.2,
Loot Shelf 1.3.3 (dropped loot drawn small, a sack for a pile; the `isGM` check in verify), Open Server 1.4.2 (the jump menu's `jQuery: false`; the jump to one's character and creatures from the Players list, its tooltip "Jump To Actor ..."; the landing scene removed), Party Stash 1.8.3, House Rules 1.4.1 (the arrow keys move tokens; going down costs a level of Exhaustion, its level now shown on dnd5e 6.0; its two sidebar-tabs rules moved to Card Catalogue in 1.4.0; installed through the installer, byte-identical), Clue Board 1.2.8 (its sidebar button's picture lifted for the black sidebar; installed through the installer, byte-identical; 1.2.6 Ctrl/Shift multi-select, the picked clues dragged onto a thread together; the window's dialogs follow it into a detached window; installed through the installer, byte-identical; 1.2.5 its sidebar button's painted picture; 1.2.4 the stamp is when, never a scene; installed through the installer, byte-identical; 1.2.3 Card
Catalogue's card, a click picks, a double click or Read opens, the chevron of Read, the thread toggles and the GM's
rows; 1.2.2 *Clue Board* and *Threads* in every word a player reads, square cards as in Scroll Case; installed through the installer, byte-identical; 1.2.1 Scroll Case's look; 1.2.0 `collect` takes `stamp: false`, `tools/add-clues.mjs`; 1.1.0 the rail beside the cards, the JSON export, solved/unsolved marks; 1.0.0 the party's
Mysteries, installed and enabled through the installer, the ten Session 02 documents migrated to Clues from their world
originals, the stash copies and the originals removed), Card Catalogue 1.0.20 (Copy link a public landing, `templates/link/link.xml`, that forwards to `/game?page=` from Foundry's own site, so a link clicked in Gmail opens the page instead of logging the user out: Foundry's session cookie is SameSite=Strict, its Data `.html` served as text/plain, `.svg` with scripts blocked; installed through the installer, byte-identical; 1.0.19 a moved page's links followed in every world document, not only journals: actors and their items, items, scenes, tables, macros, card stacks and playlists, and a scene's linked page; chat left as history; the move walked in `tools/journal-check.mjs --walk`; installed through the installer, byte-identical; 1.0.18 a page card dragged onto another journal in the rail, or one of its sections, moves the page there, its map pins and the links to it in journal text following; installed through the installer, byte-identical; 1.0.17 the ownership dialog in the case's words: opened from a case window, the actors chevron's Ownership, a card's right-click Configure Ownership in the actors and items cases or a rail folder's, Foundry's hint paragraph reads in the module's own words, while the stock directory's and the sheets' dialogs keep Foundry's; on the same `main`, the day's text review: the scenes finder's toast no longer naming Map Case, the two dead Map Case strings and their journal twins gone, the Visible-to-players view's empty text no longer naming the side panel 1.0.0 dropped, the doubled articles the Scroll Case rename left; `verify` green (156 tests), `docs-check` GREEN 50/50 on the sandbox; the annotated `v1.0.17` through the reusable workflow, `latest` serving it; the installer with only the bridge and the ball connected, its relaunch interleaved with Crystal Ball 1.0.12's, the world up after both, 69/69 served files byte-identical with the zip, a prod GM page reading 1.0.17 active; the sandbox's files redeployed `--local` from the tag's tree, its Foundry not restarted, so its module list reads 1.0.16 until a restart; 1.0.16 a card a player only has Limited on reads as dnd5e's limited sheet, its kind alone and its public biography searched; an eye on the GM's cards for the actors players see without owning; Configure Ownership on a rail folder's right-click, to share a folder in one step; installed through the installer, byte-identical; 1.0.15 the sidebar's buttons at Foundry's own size by default; 1.0.14 sidebar icons that read on black: Scenes, Actors, Placeables, Items and the Journal repainted simple with no brown, the rest lifted with a light rim; installed through the installer, byte-identical; 1.0.13 a player sees the rail's folders in the actors, items and compendium cases; installed through the installer, byte-identical; 1.0.12 Export carries each owned actor and item whole, as its sheet's Export Data writes it; only the picked cards when several are; installed through the installer, byte-identical; 1.0.11 the rails' folders in the stock directory's order; 1.0.10 what a case window opens follows it into a detached window; Ctrl/Shift multi-select, the picked cards dragged together; folders dragged in the rail; installed through the installer, byte-identical; 1.0.9 Rename Folder beside Remove Folder on a rail's right-click; 1.0.8 the compendium case; a card's stock right-click menu, its dialogs centred; painted sidebar icons and each client's button size, 1.25 by default; the sidebar left where it was when a case opens; the settings menu cut to *Enabled for <Case>?* and the size; installed through the installer, byte-identical; 1.0.7 the journal's export named `cardcatalogue-journal-…`, format `fvtt-mod-cardcatalogue/journal`, no longer Scroll Case's; installed through the installer, byte-identical; 1.0.6 the journal's *Not in a journal* row and the scenes' two players' bar rows off the rails; installed through the installer, byte-identical; 1.0.5 Export of the cards in view in every case, as the journal's; the journal's folder headings from the left; 1.0.4 a click selects a card, a double click acts; the rail's folders collapse by a
caret beside the row; *Unfiled*; *+ Create New Folder*; a right-click's Remove Folder; installed through the
installer, byte-identical; 1.0.1 the journal's bar on one line, a page's Copy link and Copy @ reference; 1.0.0 new: the journal, the scenes, the actors and
the items as cases of cards in one window, each sidebar button opening its case, a click doing its one thing and the
chevron the rest; the two sidebar-tabs rules; installed and enabled through the installer, byte-identical, every case
opening with all its cards; it replaces Scroll Case, disabled and uninstalled, its repo archived), Crystal Ball 1.0.13 (the Seer's presence record, `presence.jsonl` on the box: a line per join and leave of every user but the ball, from Foundry's own broadcast and the minute's list, read when the user asks; the box's Seer at `v1.0.13` first, then the installer PASS, 19/19 served files byte-identical with the zip, the record catching the installer's relaunch; 1.0.12 the Seer asks Foundry at each join and every minute whether it counts the ball present, `healthz`'s `foundry.counted`, and a ball not counted rejoins; the MCP's guards discount only a counted ball; the connected line names the world after a rejoin; the box's Seer at `v1.0.12` first, then the installer PASS, interleaved with a parallel session's Card Catalogue install, the Seer rejoining and counted after both relaunches; 19/19 served files byte-identical with the zip; `healthz` 1.0.12 and a forged id 401 through the public hostname; 1.0.11 the Seer leaves with a world Foundry shuts down and rejoins on a new socket once it is back, so Foundry counts the ball after an installer's relaunch: before, a socket that outlived the close was still answered but never counted, while `healthz` said connected and the guards' discount hid one real user; the box's Seer at `v1.0.11` first, then the installer PASS, the Seer rejoining 10 s after the world was back and counted; 19/19 served files byte-identical with the zip; `healthz` 1.0.11 and a forged id 401 through the public hostname; 1.0.10 the window's bar says *Crystal Ball – Clear and Ready*, *– Gazing…* or *– Dark*, never the model, which a GM's tooltip names; installed through the installer, 19/19 served files byte-identical with the zip; the box's Seer left at `v1.0.9`, nothing under `seer/` changed; 1.0.9 no empty answers: the answer-only hop after the lookups told they are spent, a wordless turn asked once more, none empty in 24 rules questions where 2 of 15 had been; Haiku's harness `haiku-6`, sources by the record's own labels and five tightening lines; installed through the installer with no player connected, 19/19 served files byte-identical with the zip; the box's Seer at `v1.0.9` after the user passed Tailscale SSH's browser check, `healthz` 1.0.9 on Haiku and a forged id 401 through the public hostname; 1.0.8 *The GM's gaze* removed: a GM reads what the players read plus their own grants, since the DM's knowledge lives in the campaign repo the ball never reads and the DM's assistant is the MCP; a world's saved row ignored; installed through the installer with no player connected, 19/19 served files byte-identical with the zip; the box's Seer at `v1.0.8`, `healthz` 1.0.8 on Haiku and a forged id 401 through the public hostname; 1.0.7 the ball's instructions a harness per model, proposed to the user and approved before it was built: Haiku's tuned, a story answer's facts then its **Glimpses**, the ball's own reading worded as possibilities, a clue's note and a thread's stand weighed as fact and marked "(the party's intuition)", rules exact and then as a collaborator, a build compared and one recommended; the general harness, for Opus and Sonnet, version 3 without its contradictions and untuned; the window's words selectable, a copy button per answer, Export as Markdown in the family's style, no count while the model has no allowance; installed through the installer with no player connected, 19/19 served files byte-identical with the zip; the box's Seer at `v1.0.7`, `healthz` 1.0.7 on Haiku and a forged id 401 through the public hostname; prod's and the sandbox's *Table notes* empty; 1.0.6 Haiku 5.5 at high effort by default, a fraction of a cent a question, by the user's choice after a night of trying Haiku, Sonnet and Opus on the sandbox; no question caps on Haiku while Sonnet and Opus keep 10 an hour and 40 a day, the dollar caps for every model; the gaze cached an hour where it is stable and five minutes where it changes; a 16,000-token output cap; installed through the installer with no player connected, 18/18 served files byte-identical with the zip; the box's Seer at `v1.0.6` by the guide's Updating over SSH, its config the committed defaults, `healthz` 1.0.6 on Haiku and a forged id 401 through the public hostname; 1.0.5 after an adversarial review of 1.0.4: the companion candidate only on a plain-http page with a bare-path setting, a 3-second probe with no session header, a dark window's re-ask only for reasons that can heal and dark on screen meanwhile, the scheduled-task tool deleted, the sandbox's Seer started beside Foundry by the MCP's `local-foundry.mjs`; installed through the installer, 18/18 served files byte-identical; the box's Seer at `v1.0.5`, `healthz` 1.0.5 and a forged id 401 through the public hostname; 1.0.4 the window finds a Seer on the companion port of the host the browser reached Foundry by, so a sandbox keeps the default Service URL; CORS for a list or any; a dark window asks again every ten seconds; installed through the installer, 18/18 served files byte-identical; 1.0.3 Arcana Unleashed's Chapters 3, 5 and 6 and Appendix left out by default, by leave-out lines scoped to that book (`dnd-arcana-unleashed: Chapter 5`), its magic-items pack dropped; installed through the installer, 18/18 served files byte-identical; the box's Seer at `v1.0.3`; prod's world saved no rulebook settings, so the new defaults are in force; 1.0.2 the rulebooks: classes, spells, features and rules looked up in the Player's Handbook, Arcana Unleashed and Heroes of Faerûn through two tools, never a stat block, the two settings *Rulebooks* and *Left out of the rulebooks*; the sandbox walk GREEN on the real model, the window's lookup line seen; installed through the installer, 18/18 served files byte-identical; the box's Seer at `v1.0.2` by the guide's Updating, `healthz` 1.0.2 and a forged id 401 through the public hostname; 1.0.1 a fresh saying over each empty sitting, no word of Claude or the DM; a 4,096-token answer cap, a cut answer marked; installed through the installer, 17/17 served files byte-identical; the box's Seer moved to `v1.0.1` by the guide's Updating, connected, `healthz` 1.0.1 and a forged id 401 through the public hostname; 1.0.0 new on 2026-11-02, `docs/plans/crystalball.md`: a player asks a Claude model about the game as their character knows it; installed through the installer, enabled; its Seer on the box as a systemd unit on the user's key, Opus at medium effort; the tunnel's `/crystalball` route above the bare hostname; the identity probe green through the public hostname; no sitting on prod yet), each the latest release. The servers' latest releases are the MCP 4.7.5 (the seat lock: a battery or a suite owns an instance and the bridge, the sandbox scripts, the installer, the deploy and the mirror refuse meanwhile, naming the holder; the watched join with `FOUNDRY_URL_FALLBACK`; the table guards' Seer discount and the Seer launcher; `set-actor-ownership`'s All Players, `manage-actors` writing the public biography, `scripts/call.mjs`; Foundry 14.370's `/join`; the release set 14/14 and the integration suite 85/2 skipped on the sandbox at 14.370; `dist` built from the tag, live in each Claude Code session on its restart; 4.7.4's `level-up-pc` saves the whole level in one batch and runs dnd5e's whole level change, the species at the new character level, each feat and feature at its own, what the level grants; a multiclass level runs its own class's subclass; every pack copy keeps its `_stats.compendiumSource`; `dist` built and smoked over the stdio server, live in each Claude Code session on its restart; 4.7.3's `manage-clues` *found*, the Clue's Found at; 4.7.2's `pull-prod-to-local.mjs --from`, mirroring a self-hosted instance over SSH; 4.7.1's refusal of a key a scene placeable function does not take; 4.7.0's `manage-clues`; `dist` built and live), imagegen 1.3.3 (the `illustration-builder` skill's map lessons; `dist` built, live on a
restart), Session Scribe 1.3.3 (transcription that hears the campaign: large-v3, its names as hotwords, a sound-alike guide, a second chunk-by-chunk pass; the skill's combat-logs page; the reader's join watchdog; `dist` built from the tag, live on a restart; 1.3.2's `generic` host). The sandbox (local Foundry 14.370, the desktop app reinstalled, dnd5e 6.0.6, mirrored from prod on 2026-11-05, its Seer on 1.0.13) runs prod's versions,
checked identical module for module after that mirror (Scroll Case and Map Case uninstalled there), and any `main` a
module's live checks left (a deploy `--check` tells). Unreleased on a `main`: nothing but docs, tooling and workflows (By the Books' contracts tool folding a name that changes run to run, `card-flags.json` caught up with 3.4.25's battery; Area Sounds' and Combat Plus's `.gitattributes`, LF checkouts); the Foundry 14.370 upgrade review (suite #10) done, every row no impact and every module's live suite green on the sandbox's 14.370 (By the Books' full battery `2026-11-06T15-07-37`, 69/69), prod on 14.370 too (the box updated the same day, its world migrated and launching on its own), `VERSIONS.md` reviewed at 14.370; the sandbox's By the Books deployed `--local` from the `v3.4.25` tree, so every module there is byte-identical with its release; no branch but `main` stands anywhere. The
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
| `fvtt-mod-clueboard` | the party's Clue Board: a Clue item type of its own, never carried; the DM collects, the record on the Group actor, a player's opening marks the read, the party's own threads to pin clues to (`docs/plans/clueboard.md`) |
| `fvtt-mod-cardcatalogue` | every directory the table uses as a case of cards (journal, scenes, actors, items, compendium), each sidebar button opening its case, Classic Mode per case and client; the sidebar shows only the tabs the table uses; a skin, no data of its own (`docs/plans/cardcatalogue.md`) |
| `fvtt-mod-houserules` | one table's always-on overrides, GM settings on by default, applied on every client; public, no blurb, so out of the catalogue |

- `fvtt-mcp-dnd5e` (public): the DM assistant, driving a live world on any host through Claude Code.
- `fvtt-mcp-imagegen` (public, key `imagegen`): Gemini art for Foundry.
- `fvtt-mcp-sessionscribe` (public, key `sessionscribe`): a Craig recording and the chat log to the session record.
- `fvtt-mod-areasounds-sfx` (private): the audio library Area Sounds ships from; not a module.
- Campaigns: `fvtt-campaign-echoesofhalruaa` (current, private, `"parent": true`); `fvtt-campaign-greenrest`
  (concluded, public, a reference clone outside `repos.json`). Retired: `fvtt-mod-battleflow` (now By the Books),
  `fvtt-mod-vendorfixes` (now Errata), `fvtt-mod-miscpatches`, `fvtt-mod-scrollcase` (now Card Catalogue's journal case;
  repo archived).

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
- **Clue Board wears Card Catalogue's look** (Scroll Case's, carried over: palette, bar, rail, cards, buttons, Reader),
  a copy kept by hand in its own classes: a change to either's look is made in both. So are two behaviours, each a
  file copied by hand: what a window opens follows it into a detached window (Card Catalogue's `shell/host.js`,
  Clue Board's `scripts/host.js`) and the Ctrl/Shift multi-pick (`shell/pick.js`, `decide/pick.js`).
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
  name its battery (`Battery: <run> — n/n suites, n/n checks, GREEN`, from `battery-status.mjs --line`) or say
  `Battery: none (pre-release)`, **and the run is sized to the release**: a patch cites a `battery.mjs --for
  v<previous>..HEAD` run (the suites its own commits reach, minutes) or the full battery, a minor the full battery;
  `build-release.mjs --tag` reads the run's `scope.json` and refuses the rest. A run red by one to three suites is
  run again with the same range, and a second run red on different suites, each green alone in `battery.mjs
  --rerun-failed <A> <B>`, is the two-run line, `--line <A> --and <B> --one-offs <C>`. Errata and FX Studio build their zips by hand with `tools/build-module-zip.mjs` (FX Studio through its `tools/build-release.mjs`, its gate first); the rest release by hand.
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
  hosted worlds are reached through the MCP, never raw file edits. **One GM seat, shared between sessions, and one
  run on it at a time:** a battery or a suite holds **the seat lock** for its length (the MCP's `src/seat-lock.ts`,
  a file naming the holder, its session and the suite it is on), and the bridge's connect, `local-foundry.mjs
  start/stop/restart` (the Seer with it), the installer, the deploy, the mirror and a second battery refuse while
  it is held, naming the holder. **Before any `foundry-local5e` call, a `local-foundry.mjs` command, a deploy or a
  battery, read the seat:** `node scripts/local-foundry.mjs status` in the MCP repo (its `seat:` line) or `node
  tools/battery-status.mjs` in By the Books, neither of which touches Foundry; a held seat means wait, or ask
  that session — never a second client, and never `--force=<pid>` over another session's run. A refusal from the
  bridge names the holder; it is the lock working, not a fault. A seat blocking a suite with the lock free is a
  bridge, never a person (`disconnect-bridge`; `{ "all": true }` for other sessions' recorded browsers).
- **Every MCP page is a GM client** running every active module, so a module disabled through the bridge runs once
  more there; a GM page script in `configure-modules.mjs`'s pattern, console captured, walks a module without a
  browser login. Each write leaves a receipt under the OS temp dir (`fvtt-mcp-dnd5e/receipts/`); the lock is per
  page, so two sessions on one bridge user interleave. `sessionscribe` joins as the bridge user.
- **Poll for a state, never sleep a beat.** A mirror (`pull-prod-to-local.mjs` with `FOUNDRY_HOST=generic
  FVTT_MCP_ENV=.env.prod` and `--from <sshHost>:<the box's Data dir>`, both bridges off; the host and dir are in the
  box's private record) replaces the sandbox's world and dev copies: redeploy after. It refuses while players are
  connected to prod, as it should. **Client settings don't mirror:** each browser keeps its own (chat cards follow
  dnd5e's Chat Log Theme; the user's choice is Light).
- **Prod** is a self-hosted Foundry box: players at `https://foundry.openrollstudios.com` (a Cloudflare Tunnel), the
  MCP over Tailscale. The box's machine record, its config and how to change it live in the user's private
  per-machine repo, never here; it is a bare Foundry box but for Crystal Ball's Seer, the one service of the suite that runs there (a systemd unit; the module's `seer/deploy/README.md` and the box's private record). Molten is retired.
- **Working on prod**, only on the user's word, from the MCP repo with the gitignored `.env.prod` and
  `FOUNDRY_HOST=generic FVTT_MCP_ENV=.env.prod` in the process env (the registrations `foundry-halruaa5e` and
  `sessionscribe` carry the same pair). The box has no file plane for the MCP (no WebDAV, not this machine's disk), so
  `deploy-house-module.mjs` can't serve unreleased files there: prod takes releases only. The installer,
  `register-module.mjs --id <repo> --manifest <the release's module.json>`, needs `FOUNDRY_ADMIN_KEY` in `.env.prod`
  (the user types it), returns the world to setup, installs the published release and relaunches, disconnecting
  everyone (`list-users` first); never a pre-release. A new module: the installer, `configure-modules.mjs --enable`,
  the installer again as the bounce. A launch answering "could not be processed" may be up: read `/api/status`
  before a retry. Retiring: `--disable`, then `uninstall-modules.mjs`. A module setting is written by a bridge
  script in `configure-modules.mjs`'s pattern (`run-script` fences `game` off). Never `game.shutDown()` via the bridge.
- **Crystal Ball's Seer on the sandbox** is started beside Foundry by the MCP's `local-foundry.mjs start` (a
  detached process, its pid beside `headless.pid`, its log the module's `seer/data/seer.log`; `stop` ends it first,
  `restart` does both, `status` shows it), never by a session's terminal or background job, which dies with the
  session and holds the port meanwhile; nothing restarts it on its own, so a crash or a reboot needs a `start`, as
  Foundry does. The ball's user is connected for as long as a Seer runs, on the sandbox and on prod;
  the MCP's `local-foundry.mjs stop`/`restart` and the mirror's prod guard ask the Seer's `healthz` and discount it while its `foundry.counted` says Foundry counts it (a socket can be open yet uncounted)
  (`scripts/lib/seer.mjs`; prod's Seer through `FOUNDRY_SEER_URL` in `.env.prod`), so neither needs `--force` for it.

## Keep this file current

A CLAUDE.md keeps its rules and at most one `**State (YYYY-MM-DD).**` block, opening in its first 30 lines and
running to the first blank line, rewritten in place when its facts change; no other date appears in it. When
something that spans modules changes (a sibling, a rename, a shared hook, a release convention), write the rule here
or in `repos.json` in the same session and put what happened under its date in `docs/log/YYYY-MM.md`; release detail
goes to the repo's CHANGELOG or release notes. Regenerate generated files rather than editing them.
