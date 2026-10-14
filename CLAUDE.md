# Open Roll 5e suite (`fvtt-suite-openroll5e`)

## What this is

The umbrella for the **Open Roll 5e** family: nine public Foundry VTT modules, three MCP servers
(the dnd5e DM assistant, image generation, the session scribe) and a private asset library. Every
one of those is its own GitHub repo with its own history, releases and CI, and that stays true.
This repo is the thin layer over them:

- `repos.json`: the manifest. Every sibling, its kind, visibility, status and, for the public ones,
  the one-line `blurb` every README uses for it.
- `sync.ps1`: clones missing siblings into this folder and fast-forwards clean ones on `main`.
  `-Status` only reports. It never commits, pushes, stashes or switches branches.
- `tools/integration-map.mjs`: writes `docs/integration-map.md` from the clones.
- `tools/suite-sections.mjs`: writes the "Part of Open Roll 5e" section of every sibling README and
  the catalogue in this repo's README from the blurbs in `repos.json` (`--check` only reports).
- `tools/upstream-watch.mjs` (daily, `.github/workflows/upstream-watch.yml`): the watch on Foundry and
  dnd5e releases; `VERSIONS.md`, `watch/`, and one `upgrade review` issue per release. See
  [Upstream upgrades](#upstream-upgrades).
- `tools/upstream-surface.mjs`: writes `watch/surface.json` (the Foundry and dnd5e names each public
  repo's shipped code uses) from the clones, for the watch's leads (`--check` only reports).
- `tools/migrate-layout.ps1`: the one-time move from the pre-2026-10-08 flat layout (below).
- `docs/examples/session-scribe/`: two complete session records Session Scribe produced for a
  concluded campaign (sessions 8 and 9, 2026-09-22 and 2026-09-29), copied here when campaign
  repos were private; the whole of that campaign is now public in `fvtt-campaign-greenrest`.
- this file: what spans repos. Each sibling's own CLAUDE.md is authoritative inside it.

This repo is public (since 2026-10-08), like the modules and the servers; its README is the public
front door of the family. The current campaign and the audio library stay private; the concluded
Greenrest campaign is public as the worked example (`fvtt-campaign-greenrest`).

**Not a monorepo.** Nothing builds here, no code is shared through here, and the sibling repos
are not submodules. They are ordinary clones that happen to live in this folder, ignored by this
repo's `.gitignore` (`fvtt-*/`). The point is one working directory that sees the whole family.

**What is in and what is out.** Inside: anything whose code reaches into another family member's
data or hooks (the modules, the three MCP servers, the Area Sounds audio library). Next to it, in the
parent folder: the campaign repos. They are content, not code, nothing references them by relative
path (the scribe finds its campaign through `SCRIBE_CAMPAIGN_REPO`, the dnd5e server through its
`.env.*` files), and they have their own committing `sync.ps1` on session hooks. `repos.json` marks
them `"parent": true` so `sync.ps1 -Status` still reports them.

## Where it lives

```
<repo parent>\                           the machine's FVTT repo parent; may hold unrelated repos
  fvtt-suite-openroll5e\                 this repo
    fvtt-mod-*\  fvtt-mcp-*\             the siblings, each its own clone, gitignored here
  fvtt-campaign-echoesofhalruaa\         campaigns stay above
```

- **History.** Until 2026-10-08 the clones sat flat in the repo parent and that folder was the
  suite repo; `tools\migrate-layout.ps1` moved them (and repaired the Battle Flow and Errata
  worktrees, patched the Claude Code user config and the per-repo local config, and renamed the
  per-project Claude folders so session history followed). The first run stopped after four
  siblings on a locked folder; the script resumes when the suite folder already exists, and the
  second run finished the move the same day.
  The MCP servers registered with Claude Code run from `fvtt-mcp-dnd5e/dist`, `fvtt-mcp-imagegen/dist`
  and `fvtt-mcp-sessionscribe/dist` under the suite path. The dnd5e server is registered twice:
  `foundry-halruaa5e` (the current campaign's Molten box, PROD) and `foundry-local5e` (the sandbox).
  Renaming or moving the suite folder means patching those registrations again.
- **Relative paths across the boundary.** `../fvtt-mcp-dnd5e` from a sibling still resolves (they
  moved together); the campaign repos are `../../fvtt-campaign-*` from a sibling; anything outside the
  family (vendor snapshots, FX Studio's asset drops, kept next to the repo parent) is three levels
  up from a sibling, not two. Errata's snapshot default was corrected on 2026-10-08.
- **Setting up a machine:** clone this repo into that machine's FVTT repo parent, `cd` into it,
  run `.\sync.ps1`, and clone the campaign repos next to it.

## Working here

- Open the Claude Code session with **this folder** as the working directory when the work crosses
  modules (a rename, a shared hook, a sister-modules README sweep, a release round). Open the
  sibling itself for work inside one module; its CLAUDE.md, tests and tools are written for that.
- Git is per sibling: `git -C fvtt-mod-fxstudio status`, and so on. Commits in this repo are for
  the files this repo tracks. If a `fvtt-*` path ever appears in `git status` here, the ignore is
  broken; fix that before committing.
- **"Open issues" means this suite's, minus Errata** (the user, 2026-10-10). Query this repo and
  each `"status": "active"` repo in `repos.json` one by one (`gh issue list -R Txpple/<repo> --state open`),
  skipping `fvtt-mod-errata5e`. Never an owner-wide `gh search issues`: it pulls in repos outside the
  family, the retired `fvtt-mod-vendorfixes` copies of Errata's register, and its result cap lets
  Errata's hundreds of issues crowd the rest out. Errata's issues only when asked for by name.
- A feature worktree may sit beside its clone, and a sibling's `.claude/worktrees/` may hold
  Claude worktrees. `sync.ps1` and the map generator skip worktrees. As of 2026-10-12 none exist
  and every clone has only `main`, locally and on GitHub; the merged leftovers (By the Books' six
  local branches, its `feat/cover-hover` and `claude/bold-einstein-9faddc` on GitHub, an Errata
  Claude worktree, and Greenrest's local-only `private-history`, its history from before it went
  public) were deleted that day.
- After adding, renaming or retiring a module: update `repos.json`, run `node tools/suite-sections.mjs`
  (the "Part of Open Roll 5e" README sections, below), `node tools/integration-map.mjs` and
  `node tools/upstream-surface.mjs`, commit the rewritten READMEs in their own repos, and commit the
  result here. Rerun `upstream-surface` too when a module starts or stops using a hook.

## The family

Snapshot 2026-10-08. Versions and compatibility are in `docs/integration-map.md`, regenerated from
the manifests; the table there is the one to trust.

**Modules** (public, Foundry title `Open Roll 5e: <Name>`, package id = repo name):

| Repo | Title | Does |
|---|---|---|
| `fvtt-mod-autoexplore` | Autoexplore | Scene starts fully explored; tokens still need line of sight; no fog data written |
| `fvtt-mod-bythebooks` | By the Books | The 2024 rules played from the sheet: auto damage on hit, reaction holds, auto saves, concentration, rests, senses, sizes, lights; a receipt and a revert for each step (Battle Flow until 3.0.0, 2026-10-11) |
| `fvtt-mod-combatplus` | Combat Plus | Fight chores: combat music, initiative gate, out-of-turn movement block, defeated marking, turn alerts; GM Vision (ported from dev7355608, MIT, 1.6.0) |
| `fvtt-mod-errata5e` | Errata | In-memory stopgap fixes for vendor bugs (premium 2024 books, dnd5e, Foundry); the vendor-bug register |
| `fvtt-mod-fxstudio` | FX Studio | Visual and sound FX from what happened at the table, via Sequencer + JB2A + PSFX; requires `sequencer` |
| `fvtt-mod-lootshelf` | Loot Shelf | Loot chests and merchant shelves players use without owning them; chat receipts |
| `fvtt-mod-openserver` | Open Server | Hosted worlds: clears the startup pause, per-user landing scenes |
| `fvtt-mod-partystash` | Party Stash | A dnd5e Group actor's inventory as a working party stash: moves not copies, coin dialog, receipts |
| `fvtt-mod-areasounds` | Area Sounds | Scene background sound: one-shots with silence, crossfaded loops, day/night gating, quiet in combat (Soundscape until 2.0.0, 2026-10-10) |

**MCP servers and assets:**

- `fvtt-mcp-dnd5e` (public): the DM-assistant MCP server; drives any live Foundry world (Molten
  Hosting, a local install, a URL) through Claude Code. Formerly `fvtt-mcp-molten5e`. The 2026-10-11
  pass (its record: `docs/history/handoff-2026-10-11.md` there) made it shareable: every write
  answers with a receipt and `run-script { undo }` reverses it, `FOUNDRY_TOOLSETS=readonly` is a
  safe first registration, `npm run init` writes the `.env` and the registration and runs the
  doctor, and `get-world-info` reports the bridge (renderer, the family modules active, warnings).
  4.6.0 (2026-10-12) is the latest release. Open: #18, `tools/list` is 13 chars under its 205,000
  ceiling in `src/measure.test.ts`, so the next tool field fails `npm test` until that is decided.
- `fvtt-mcp-imagegen` (public): Gemini image generation for Foundry art; server key `imagegen` (was `artificer` to 2026-10-08). Formerly `fvtt-app-artificer` (to 2026-10-08) and `fvtt-mcp-artificer` before that.
- `fvtt-mcp-sessionscribe` (public): Craig recording + Foundry chat log to session record; server key `sessionscribe` (was `scribe` to 2026-10-10); home of
  the `session-scribe` skill. Formerly `fvtt-app-sessionscribe` (to 2026-10-08).
- `fvtt-mod-areasounds-sfx` (private): the audio library Area Sounds ships from, published to
  `Data/areasounds-sfx/`. Not a module. Formerly `fvtt-mod-soundscape-sfx` (to 2026-10-10).

**Campaigns** (next to the suite in the parent folder, `"parent": true` in `repos.json`):
`fvtt-campaign-echoesofhalruaa` is the current campaign (scaffolded 2026-09-27 as
`fvtt-campaign-next`; it has its own committing `sync.ps1` on session hooks, which the dnd5e MCP
repo's session hooks also call); it is private. `fvtt-campaign-greenrest` is concluded and public
(since 2026-10-08) as the worked example of a campaign repo; its clone is a reference, nothing syncs
it, and it has no MCP bridge (`foundry-greenrest5e` was retired 2026-10-08; its Molten box is still up).

**Retired:** `fvtt-mod-battleflow` (renamed to `fvtt-mod-bythebooks` in 3.0.0, 2026-10-11, issue
#6 of that repo; uninstalled from prod and the sandbox 2026-10-12; GitHub redirects the old name, and Foundry refuses the new manifest as an update
to the old id, so a 2.x world sees an update error, never a wrong install), `fvtt-mod-vendorfixes`
(replaced by Errata; archived, private, not cloned here) and
`fvtt-mod-miscpatches` (retired 2026-09-25; the GitHub repo no longer resolves and no clone is
kept; the Open Roll 5e README sections stopped listing it).

## How they fit together

The full picture is `docs/integration-map.md`. The shape of it:

- **Every module installs and works alone.** The "Part of Open Roll 5e" section in each README promises
  that ("each installs and works on its own and none needs another"). Cross-module behaviour is
  detection, `game.modules.get(id)?.active`, never a `requires` relationship. The only hard
  dependency in the family is FX Studio on the third-party `sequencer`.
- **By the Books is the rules engine and the hub.** It emits `bythebooks.moment` (plus `armorBlock`,
  `styleDice`, `holdOpened`, `castReleased`, `areaAskAnswered`, `deferredUsageCard`); 3.0.x also
  fired each under its old `battleflow.*` name, and 3.1.0 (2026-10-12) stopped. FX Studio listens
  through `scripts/readers/bythebooks.js` (`battleflow.moment` too, for a table still on 2.x; one
  play per `momentId`) to play effects from what happened, and emits `fxstudio.rebuilt`. Session Scribe reads By the
  Books' chat cards when building a session record: the `fvtt-mod-bythebooks` flag scope, falling
  back per card to `fvtt-mod-battleflow` (cards posted before 3.0.0 keep it for good).
- **Loot Shelf knows Party Stash** (receipt settings line up when both are present), and **By the Books knows Loot
  Shelf**: a companion (Find Familiar) that leaves the table drops what it carried as an ephemeral Loot Shelf chest
  (`api.createLootContainer`) when Loot Shelf is active, else the gear is lost.
- **Two modules touch Foundry's Token class at `setup`.** Combat Plus's GM Vision (behind its switch,
  GM clients only) wraps `CONFIG.Token.objectClass` with an `isVisible` override; Loot Shelf patches
  `_canView` on whatever class is there (shop and chest tokens); and Combat Plus's Portrait View
  (1.7.0, on by default) patches `_canView` and `_onClickLeft2` the same way, so a player's
  double-click on a token they can't view opens its portrait. Portrait View steps aside for Loot
  Shelf's flagged tokens while Loot Shelf is active. Every patch defers to the one beneath it, so
  any order works; a module that replaced the class after `setup` would drop them all. Combat Plus leaves the job to the upstream `gm-vision` module when
  that is active, so the class is never wrapped twice.
- **The MCP writes into two modules' data.** `src/page/scenes.ts` sets Open Server's landing-scene
  flag and `src/page/areasounds.ts` authors Area Sounds' per-scene sound sets (flags only), and
  `src/page/world.ts` names By the Books (and its old id, reported as legacy), Area Sounds and Open Server by package id so
  `get-world-info`'s `bridge` block can report them active (with versions) and warn when a tool's
  module is missing. When one of those three is renamed or retired, all of that needs the same
  edit. Its local (gitignored) `scratch/siblings-census.mjs` reads the sibling list from `repos.json`.
- **Hook naming is the contract:** a hook `<short>.<event>` belongs to the module whose id is
  `fvtt-mod-<short>`. Add new hooks in the emitting module, document them in its README, and make
  every listener tolerate the hook never firing.

## Upstream upgrades

A Foundry or dnd5e release can break a module or bring something worth adopting; Foundry 14.367
and 14.369 each reshaped `/join` and hung the MCP bridge on every world. The watch:

- **Daily Action** runs `tools/upstream-watch.mjs --notify`. Foundry: every channel is read, only
  Stable asks for a review (a newer Testing/Development build shows as VERSIONS.md's Newest
  pre-release). dnd5e: published GitHub releases. Premium books stay with Errata's own watch.
- **On a release newer than Reviewed** it writes `watch/<package>/<version>.md` (the releases
  covered; dnd5e's notes verbatim, MIT, and its tag diff; Foundry's notes are linked, not copied,
  and only the lines a lead matched are quoted) and opens one `upgrade review` issue here with a
  row per public repo and that repo's leads (its `watch/surface.json` names matched against the
  notes and the dnd5e diff, sharpest first). Leads are places to look, not verdicts.
- **The review** is a Claude Code session in this folder: read the notes file, judge each row
  (`no impact`, `breaks: …`, `adopt: …`, linking the sibling issue when there is work) and tick it.
  The fvtt-mcp-dnd5e row is done only with the new build's `/join` fixture in its tests (Foundry
  releases) and an `npm run smoke:bridge` line from the updated sandbox; the Errata row is Errata's
  own version review. Then set Reviewed and Reviewed on in `VERSIONS.md` and commit; the next watch
  run closes the issue, and only once no row is left unticked (dispatch the workflow to close it now).
- The watch's stdout is a log; its summary goes only to `--summary <file>`.

## Conventions

- **Names.** Repo `fvtt-<kind>-<name>` with kind `mod`, `mcp`, `campaign`, `suite`; the
  name part has no hyphens; `app` was tried for the two smaller servers and dropped 2026-10-08, since each is one stdio MCP server like the dnd5e one. Package id = repo name. Foundry title `Open Roll 5e: <Name>`. The
  2026-10-02 rename round is complete. Battle Flow became By the Books on 2026-10-11 (3.0.0, the
  module's issue #6), the second rename after Area Sounds. "Sister" and "sibling" are not used in public text; a
  module is "part of Open Roll 5e" and two that pair up are "companions". Before naming a
  module, check the Foundry package list for a title that clashes: Soundscape clashed and became
  Area Sounds (2.0.0, 2026-10-10). The definitive list is the one a setup screen installs from (a
  `getPackages` post to `/setup` with no world active); the website's search only ranks text. A
  rename changes the flag scope, so the module carries a read fallback and a GM-load migration
  from the old scope (Area Sounds' `scripts/store.js`; By the Books' `scripts/migrate.js`, which
  also refuses to run beside the old package, since two copies would act twice).
- **Branches.** `main` everywhere, nothing else long-lived. Feature work in a branch or worktree;
  delete it, locally and on GitHub, once it is merged.
- **Contributions.** Every public repo accepts issues and does not accept pull requests (the user,
  2026-10-08). The generated README section says so, and each repo carries
  `.github/PULL_REQUEST_TEMPLATE.md` saying it again to anyone who opens one.
- **State blocks.** A sibling CLAUDE.md carries at most one dated `**State (YYYY-MM-DD).**` block,
  near the top, rewritten in place when the facts change; dated status lives nowhere else in that
  file. Errata, FX Studio and Session Scribe follow it since 2026-10-08.
- **Releases.** One GitHub release per module version. The manifest URL every world installs from
  is `https://github.com/Txpple/<repo>/releases/latest/download/module.json` and the download is
  `.../releases/download/v<version>/<repo>.zip`, so a release must carry both assets. By the
  Books has `release.yml` + `verify.yml`; Errata has `check.yml` + `upstream-watch.yml`; the MCP and
  Session Scribe have `ci.yml`. The other modules release by hand.
- **"Part of Open Roll 5e" README sections.** All nine module READMEs and the three server READMEs
  carry one, between `<!-- openroll5e:family -->` markers, listing the rest of the family with the
  `blurb` from `repos.json`. `node tools/suite-sections.mjs` rewrites them all (`--check` to verify);
  never edit the section by hand. The sections replaced the "Sister modules" sections on 2026-10-08.
- **Foundry compatibility.** All verified on 14; minimums range 11 to 14 (By the Books and FX
  Studio are 14-only). The system, where declared, is dnd5e. A local checkout of the dnd5e system source
  (the 5.x release line) is the reference when a question needs the system's own code.
- **Tooling tiers.** By the Books, the MCP and both apps have Biome + TypeScript config + Vitest;
  Errata has its register check; FX Studio, Loot Shelf, Party Stash and Area Sounds have a
  package.json with tools but no linter or tests; Autoexplore, Combat Plus and Open Server are a
  `module.json` plus `scripts/`. When a small module grows tooling, copy By the Books' Biome config
  rather than inventing a new one.
- **Reaching prod.** Prod (Echoes of Halruaa on Molten) is reached through a gitignored `fvtt-mcp-dnd5e/.env.halruaa` (`FOUNDRY_HOST=molten`, the box URL, the bridge user, the WebDAV password); a new machine recreates it from `.env.example`. Deploy with `FOUNDRY_HOST=molten FVTT_MCP_ENV=.env.halruaa node scripts/deploy-house-module.mjs <repo> [--check]` from the MCP repo; `FOUNDRY_HOST` must be in the process env too. The deploy refreshes the served files (live on the next world reload), but `game.modules` is built when the Foundry process boots, so the version string keeps showing the old release. The Molten panel's Restart is UI-only; the lever that refreshes the live package cache is Foundry's own installer, driven by `FOUNDRY_HOST=molten FVTT_MCP_ENV=.env.halruaa node scripts/register-module.mjs --id <repo> --manifest https://github.com/Txpple/<repo>/releases/latest/download/module.json` from the MCP repo: it returns the world to setup, reinstalls the module from its GitHub release and relaunches the world (Area Sounds 2.0.1 and Autoexplore 1.1.2, 2026-10-10). It disconnects everyone, so check `list-users` first, and the release must already be published since it installs from the manifest, not the clone. By the Books 3.0.0 reached prod that way on 2026-10-11, then `scripts/configure-modules.mjs --enable fvtt-mod-bythebooks --disable fvtt-mod-battleflow` and a second register-module run as the bounce; the first run's launchWorld answered "The request could not be processed" although the world came back up, so read `/api/status` before a retry bounces it again. On 2026-10-12 Battle Flow was uninstalled from prod (`scripts/uninstall-modules.mjs`, after it was disabled) and from the sandbox (the next `pull-prod-to-local.mjs` mirror deleted its folder), and By the Books 3.1.0 and FX Studio 0.9.1 went in through the installer; FX Studio's House in the repo is prod's own, so its reinstall changed none of prod's FX. Combat Plus 1.7.0 (Portrait View, its issue #2) went in through the installer on 2026-10-12 too. By the Books 3.2.0 (gear lights, its issue #7: a Candle, Torch, Lamp or Lantern toggles a coloured, flickering light on the bearer) went in the same way on prod and the sandbox later on 2026-10-12, and the third-party `torch` module it replaces was disabled (`configure-modules.mjs --disable torch`) and uninstalled (`uninstall-modules.mjs --ids torch`) on both. By the Books 3.3.0 (summons placed like Misty Step, one creature picker, Find Familiar as a companion, one leading window per GM; its issue #1) and FX Studio 0.10.0 (the summon and unsummon moments) were released on 2026-10-12 without a battery run and went onto the sandbox and, the same day, prod through the installer (`register-module.mjs`, prod's House byte-identical to the repo first, so no FX changed). By the Books 3.4.0 (Summon Art: a settings button opening a window of token and portrait overrides per summoned creature, Find Familiar first; its issue #1) went onto prod through the installer on 2026-10-12, with 54 familiar art files in prod's `worlds/echoes-of-halruaa/assets/familiars/` and prod's `summonArt` table loaded with all 27 Find Familiar names; the sandbox was then re-mirrored from prod. By the Books 3.4.1 (summons straight to its menu, light spells on a token or an object, rests end the short effects, Summon Art for all 18 summon spells; a patch, the user's versioning rule) went onto prod through the installer on 2026-10-12 with no one connected; Its generated summon art (41 files, `worlds/echoes-of-halruaa/assets/summons/`) and the Summon Art table entries for the 18 spells were copied to prod the same night, Find Familiar's own entries kept. By the Books 3.4.2 (2026-10-13: dnd5e's Cast Spell dialog before the summon menu, one button per summon spell, Spiritual Weapon's and Conjure Animals' picks, the pack's emanations, Wild Companion as Find Familiar, Wild Shape's known forms only, a Wild Shape Art window, every module effect drawn on its token) went onto prod through the installer with no one connected; the new art (`assets/summons/`, `assets/wildshape/`) went up over WebDAV and the sandbox's Summon Art and Wild Shape Art tables were merged into prod's, then the sandbox was re-mirrored from prod. The full battery after it found two real bugs, fixed in 3.4.3 the same day (a recast of the same concentration spell past the dialog asked about ending itself, since 3.4.1; a summon's own `@mod` dropped from its dice line, 3.4.2) and suites behind the day's rulings, brought up to date; the re-run was green but for one Metamagic timing flake (9z) that passes alone. 3.4.3 went onto prod through the installer and the sandbox was re-mirrored again. The warlock pass (2026-10-13): By the Books 3.4.4 (Hex as an ability pick with Cast/Move and the slot's longer Concentration, the Vestige Companion and Pact of the Chain's forms as familiar-style companions, summons that turn to face their movement, every rule under its closed tick with `tools/check-rule-folds.mjs` in verify, rescues offered only when they can win), FX Studio 0.10.1 (Magical Cunning a short burst) and Errata 1.2.2 (E-005 the PHB creatures' Dexterity attacks, E-006 the Celestial vestige) went onto prod through the installer after a full battery (46 suites green, 6 brought to the day's rulings and re-run green); the Pact of the Chain and Vestige art (22 files under `assets/familiars/` and `assets/summons/`) went up over WebDAV and the sandbox's Summon Art table was merged into prod's. FX Studio 0.10.2 (Fiendish Vigor a buff on the warlock: the PHB invocation is its own heal activity, so it reaches FX Studio as `feature:fiendish-vigor`, not the spell) and By the Books 3.4.5 (below) went onto prod through the installer on 2026-10-14 with no one connected, prod's House byte-identical before and after. The sandbox was re-mirrored from prod on 2026-10-14 (after session zero), at the user's ask; that replaced its test characters on Party Camp (BTB Test Warlock, Mage, Bard, Party Fighter), whose old world DB was kept only as a scratch backup; and again that evening once By the Books 3.4.5 and FX Studio 0.10.2 were on prod (`FVTT_MCP_ENV=.env.halruaa node scripts/pull-prod-to-local.mjs` from the MCP repo, both bridges disconnected first since each counts as a connected user; 616 files down, the By the Books Test Range scene and 22 test actors gone, the art tables already identical), so the sandbox runs the releases, not dev copies. The `sessionscribe` registration carries the same `FVTT_MCP_ENV` (since 2026-10-10) and joins as the bridge user, Assistant DM (no separate scribe user, the user's ruling 2026-10-10). The `foundry-local5e` server is a local copy, never prod. Battle Flow issue #5 (one dnd5e key per GM load) was traced to slow sequential writes and fixed in v2.16.2 (2026-10-10).
- **Session zero's combat notes, shipped (2026-10-14).** By the Books 3.4.5 (Familiar Friend from Arcana Unleashed: the
  free cast as a Consumption line, Fortified Familiar's HP landed by the elect, Helpful Friend as a greyed-or-offered buy
  within 5 ft; Sleep as a repeat-save row; the thirteenth setting *Going Down Costs a Level of Exhaustion*, off by
  default, the campaign's house rule; the downed conditions applied out of combat; the rescue window's "Accept the
  roll") was released on the user's word **without a battery** (walked by hand on the sandbox; `npm run verify` green;
  the two owed battery runs stay owed) and went onto prod through the installer with no one connected. Prod was then
  set: *Going Down* **on** (through a bridge script in `configure-modules.mjs`'s pattern, since `run-script` fences
  `game` off and no tool writes a module setting), dnd5e *Apply Downed Conditions* **all** (`configure-dnd5e-settings`),
  and Tom's Owl to 3/3 HP; the sandbox had both settings on already. Errata issue #792 names the pack's inert Fortified
  Familiar enchantment (no fix: the rule is the module's).
- **Portent widened (2026-10-14), shipped in By the Books 3.4.6 the same day.** The analysis
  found Portent's own-roll ticks sound on checks (the missing tick on the user's seat was not reproduced; a skipped dialog is the
  one per-seat cause) and the bystander offers narrow by the 2026-09-29 ruling, unchanged since v2.10.0. Built as the plan
  recommended (`audits/plans/portent-widened.md`; RULINGS *Portent widened*): a check or a requested save whose roll carries a
  DC (dnd5e's `options.target`) asks the diviner like a demanded save and the card says SUCCESS or FAILURE; a bare check still
  asks nobody; ordinary hits stay the quiet card row (the meter re-run: 8–9 popups a fight against 1–3). And the rest's Portent
  dice are the bearer's to roll (the user, "way more fun"): the rest card asks with a Roll button, the dice land as the
  player's own roll, the timer rolls when it runs out. `smoke-classes` §41, §52, §82 (amended) and §126 (new) green on the
  sandbox 2026-10-14. Released as **3.4.6** that evening with Battle Familiar, on the user's word and **without a battery** (the
  third owed), and onto prod through the installer with no one connected; the sandbox carries the same bytes (`--local`). The
  user keeps working on Portent in the next version: `audits/plans/portent-test-handoff.md` is the table walk, the plan's W2
  and W3 the open questions. The same walk found three more, in 3.4.6 too: the ways-to-pay line re-ticked the slot box once the free cast was spent (the
  user could not clear it; RULINGS *Summons* call 57); **Fortified Familiar counted twice** — dnd5e's feat grant copies the
  feat's enchantment onto the granted spell, so the system's own landing already adds 2 × level and the module's boon added
  it again (a Crab at 33), and Tychon's sheet carries the enchantment twice from a doubled grant at session zero (prod and
  the sandbox; one copy to delete), so Errata #792's premise is wrong (call 58); an empowered familiar wore the form's token
  ring (call 59).
- **Battle Familiar (2026-10-14), shipped in By the Books 3.4.6.** Arcana Unleashed's spell, the spell alone
  (Warlike Familiar's free cast and Intercept Attack parked as WAITS): conjured on the summon road (its own Initiative, one
  at a time, gone at 0 HP leaving its gear, gone at the caster's death, the last form pre-picked) or, with a Find Familiar on
  the table, the familiar empowered in place through dnd5e's own transform (the familiar keeps its name, art, type and Hit
  Points; the form's Hit Points as temp HP; reverts when they run out, the hour passes, or the caster's "Battle Familiar:
  ⟨name⟩" effect goes; a familiar in its pocket refuses the cast). The plan and the sandbox measures: the module's
  `audits/plans/battle-familiar.md`; the rulings: its RULINGS *Summons* calls 48–55. Live: `smoke-familiar` §9–§13,
  `smoke-summons` §9, `smoke-companions` (a familiar's whole life: one companion effect, one token, one record after
  every step; the landing sweeps orphaned companion effects, the pocket's way to a double), all green 2026-10-14. Released
  in 3.4.6 the same evening and on prod through the installer. **Two GM clients at once** (the DM's window beside
  the bridge, later a co-DM): the impact analysis and the work it implies are issue #8 here.
- **Testing host.** The development machine runs a local Foundry (14.369, dnd5e 6.0.6; 14.369 renamed the /join user field to `userId`, which the bridge matches case-insensitively since 2026-10-09); the
  worlds in play are hosted (Molten Hosting) and reached through the MCP. Prefer the MCP over raw
  file edits for world data.
  A GM seat on the sandbox that blocks a suite is an MCP bridge, never a person: this session's (`disconnect-bridge`)
  or a parallel session's (the app keeps every open session's MCP servers alive; `disconnect-bridge { "all": true }`
  names every other holder and ends only the browser each recorded, by pid and executable path, keeping any record
  it cannot settle; since 2026-10-11 the bridge also caps a hung page op and rejoins on the next call). Every MCP
  write leaves a receipt under the OS temp dir (`fvtt-mcp-dnd5e/receipts/`, keyed by server and world); the lock
  behind it is per page, so two sessions on one bridge user still interleave at the server. Foundry 14.369 is
  faster than 14.367: a Battle Flow battery went red on polling and on a popup's close window with the module
  unchanged (Battle Flow issue #8, `tools/README.md` *A faster platform turns a poll into a lie*).
- **Client settings don't mirror.** Client-scope settings live in each browser per site address, so
  prod and the sandbox can look different with identical world data, and every new browser or
  machine starts from defaults. The one that bit (2026-10-14): chat cards dark on prod, light on the
  sandbox, with core Color Scheme Dark/Dark on both. The lever is dnd5e's **Chat Log Theme**
  (Configure Settings → Dungeons & Dragons Fifth Edition; `dnd5e.chatLogTheme`, client). Blank
  follows the Applications theme; the user's choice is **Light**. Each player sets it for themselves.

## Keep this file current

When something changes that spans modules (a new sibling, a
rename, a shared hook, a release convention), record it here or in `repos.json` in the same
session. Regenerate the map rather than editing it.
