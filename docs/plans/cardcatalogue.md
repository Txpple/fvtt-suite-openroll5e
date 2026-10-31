# Plan — Card Catalogue, a new Open Roll 5e module

**BUILT 2026-10-31 as 0.1.0, a working draft on the sandbox**, local only (`fvtt-mod-cardcatalogue`, no repo; the
user's rulings and *As built* at the end). The brief, from the user after Map Case 0.1.0 was walked on the sandbox: keep Clue Board
separate, as it is ("it is not just a UI reskin"); make one new module that folds Scroll Case, the two sidebar-tab
rules from House Rules, scenes (Map Case), items and actors into one; then retire Scroll Case and take the two rules
out of House Rules. Earlier the same day: "id like to do similar with actors and items too. lets prototype with
scenes first". The name follows the family's convention (two plain words for the thing): a library's card catalogue
is drawers of index cards you search to find anything in the collection.

## The brief, as contours

| # | The brief | What it asks of the module |
| --- | --- | --- |
| C1 | "folds scroll case ... into one module" | Scroll Case's journal case, every behaviour kept: the window, the search, Show into the Reader, the player's window, Undo, the finder, page links, the export |
| C2 | "scenes" | Map Case 0.1.0 as the scenes case (`docs/plans/mapcase.md`), never released on its own |
| C3 | "items, actors" | an actors case and an items case in the same window and look; what their one button does is the user's to rule (below) |
| C4 | "the 2 house rules" | Players and GMs see only the sidebar tabs they use, each its own switch, moved whole from House Rules |
| C5 | "scroll case gets retired, and the 2 house rules" | a cut-over that loses nothing: settings, each browser's pins and *Recently shown*, page links; House Rules 1.4.0 without the two rules |
| C6 | "clue board ... separate, as is" | Clue Board untouched; it copies the look from here instead of from Scroll Case |
| C7 | Scroll Case's ruling, carried over | a skin: no flag, no document of its own; every world write one the stock directory or sheet makes |

## What there is today

- **Scroll Case 1.0.4**, released and on prod: the Journal button opens it; settings `enabled` (world),
  `classic` (client), `showKeeps`, `assetFolders`, `handoutsJournal` (world); each browser's record in localStorage
  under `fvtt-mod-scrollcase.<world>.<user>` (pins, recent, seen, baseline, view, type, size); a Show on its socket
  channel `module.fvtt-mod-scrollcase`; the hook `scrollcase.shown` (nothing listens); page links
  `/game?page=<uuid>`; the finder on Ctrl+Shift+H. Nothing of it is in the world but those settings.
- **Map Case 0.1.0**, local only: the Scenes button, the scenes case, Ctrl+Shift+M; a record under
  `fvtt-mod-mapcase.<world>.<user>`.
- **House Rules 1.3.0**, on prod: four rules; two are the sidebar's (`sidebarTabs`, `gmSidebarTabs`, world, on,
  `requiresReload`), in `scripts/rules/sidebar-tabs.js` (pure, tested) and `houserules.js` (the writes and the two
  backing hooks).
- **Clue Board 1.2.2** adds its button after Journal on the strip and wears Scroll Case's look by hand.
- **The two cases share most of their code by copy**: the button takeover, Classic Mode and the way back, the
  window's frame, the search that never redraws, the focus keeping, the finder, the browser's record, the stylesheet.
- **Foundry 14's Actors and Items directories** offer Edit (the sheet), View Character Art and Token Art (actors),
  View Art (items), Ownership, Duplicate, Export, Import, Delete. Players keep the Actors tab; the players' rule takes
  Items away from them.

## The idea in one line

**Every directory the table uses is a case of cards in one window: the sidebar's button opens it on its case, one
click does that case's main thing, and the sidebar shows only the buttons the table uses.**

## The module

### One window, four cases

- **Card Catalogue**, one window per client. Along the top of the rail, the cases: **Journal**, **Scenes**,
  **Actors**, **Items** (a case the user cannot see is not drawn: Scenes for a player, Items while the players' rule
  is on). Below them, each case's own views and folders, as Scroll Case and Map Case draw them.
- **The sidebar's own buttons open it on their case**: Journal, Scenes, Actors, Items, each intercepted on the
  button as Scroll Case does (click and middle click, failing open to the stock tab; a right-click is still
  Foundry's popout). The window remembers each case's view, search and size.
- **Classic Mode per case, per client**: a switch in the case's bar puts that directory's stock tab back on this
  client, and the stock directory carries the way back. A world setting per case turns the case off for everyone.
- **One look**, Scroll Case's, in one stylesheet. Clue Board copies it from here (the suite rule moves).

### The journal case (Scroll Case, whole)

Every behaviour of Scroll Case 1.0.4 (C1), its rules unchanged: the cards and their shapes, the search and where it
matched, Show / Reveal / Add & show with the chevron's options, Undo of a reveal, the player's window (All, New, the
Reader), no GM secret reaching a player, sections as the filing, *Not in a journal*, the export, the page links.

### The scenes case (Map Case, whole)

Map Case 0.1.0 as built (C2): wide 3:1 cards, Activate (Pull everyone on the active scene) with Undo, the chevron
(View, Edit, Notes, Preload, the players' bar, the thumbnail), folders and drag-to-file, GM only.

### The actors case (new)

- **A card per actor the user can see**: the portrait (`img`, a tall one cropped from the top as Scroll Case frames
  it), the name, the type (character, NPC, group, vehicle, encounter), a level or CR, the folder; for the GM the
  players who own it.
- **The rail**: All, Characters, NPCs, Groups, In this scene (an actor with a token on the viewed scene); the folders.
  A player's: All, then their own characters first.
- **The search**: name, type, folder, class and species, CR, the owners' names, the biography's words (a player's
  without anything they cannot see).
- **The one button and the chevron**: the user's ruling (Q1). Proposed: **Open** (the sheet) on the card; the
  chevron holds **Show the art** (to everyone online, as the stock View Character Art's Show does, through the
  Reader), **Show the token art**, **Place a token** (on the viewed scene, at the view's centre, as a drag would),
  **Edit ownership** (the stock dialog), **Copy link**. Dragging a card onto the canvas places a token, onto a sheet
  or a journal what Foundry's own actor drag does.

### The items case (new)

- **A card per world item**: the icon or art, the name, the type, rarity, price, attunement, the folder.
- **The rail**: All, then by type (Weapons, Equipment, Consumables, Tools, Loot, Spells, Features, Containers); the
  folders.
- **The search**: name, type, rarity, folder, the description's words, the source book.
- **The one button and the chevron**: the user's ruling (Q2). Proposed: **Open** on the card; the chevron holds
  **Show the art**, **Post to chat** (dnd5e's own item card), **Give to…** (a party member or the party stash: the
  copy the stock drag onto a sheet makes), **Copy link**. GM only while the players' rule takes Items away.

### The sidebar tabs (from House Rules, whole)

The two rules exactly as House Rules 1.3.0 keeps them (C4): players lose Combat, Placeables, Items, Rollable Tables,
Cards and Macros; GMs lose Combat, Rollable Tables, Cards and Macros; every other tab, a module's included, stays.
Each its own world switch, on by default, `requiresReload`; `sidebar-tabs.js` and its tests move as they are.
**While House Rules still registers its own two settings** (an older House Rules beside this), these step aside, so
either order of installing works and a tab is never hidden twice.

### The finders

One per case (the user's ruling), each Scroll Case's finder over its own cards: the journal's on Ctrl+Shift+H (a page
**shows**, as today), the scenes' on Ctrl+Shift+M (a scene **views**), the actors' and the items' unbound until the
table picks a key (an actor or an item **opens**). Shift+Enter opens the chevron, Ctrl+Enter the case's second action.

## The cut-over

| What | From | To | How |
| --- | --- | --- | --- |
| Scroll Case's world settings | `fvtt-mod-scrollcase.*` | `fvtt-mod-cardcatalogue.journal*` | on a GM's first load, each copied once if never set here (read from the world's Setting documents, which outlive the module) |
| Classic Mode (client) | Scroll Case's localStorage key | the journal case's | read once per browser |
| Each browser's record | `fvtt-mod-scrollcase.<world>.<user>`, `fvtt-mod-mapcase.…` | the journal and scenes sections of one record | merged once per browser, the old keys left for a week, then removed |
| The tab rules' switches | `fvtt-mod-houserules.sidebarTabs`, `.gmSidebarTabs` | here | copied once on a GM's load |
| A Show | `module.fvtt-mod-scrollcase` | `module.fvtt-mod-cardcatalogue` | a new channel: a server restart, which the installer's relaunch is |
| The hook | `scrollcase.shown` | `cardcatalogue.shown` | nothing listens; the integration map regenerates |
| Page links | `/game?page=<uuid>` | the same | the parameter is the module's own and unchanged |

**On prod, one sitting** (players reconnect at the end): the installer for Card Catalogue, `configure-modules
--enable`, the installer again as the bounce; House Rules 1.4.0 through the installer; `configure-modules --disable
fvtt-mod-scrollcase` then `uninstall-modules.mjs`. Then the suite: `repos.json` (Card Catalogue in, Scroll Case
retired, Map Case never added), the family table, the generators, Clue Board's look rule pointing here, the log.
**Scroll Case's repo** gets a last README line pointing here and is archived on GitHub (the user's word).

## What it never does

- Never writes a flag, a field or a document of its own (C7). The writes are the stock ones: a page's ownership and
  section, a new section, an image page for a kept picture (journal); `active`, `navigation`, `thumb`, `folder`
  (scenes); a token placed, ownership through the stock dialog (actors); an item copied onto an actor, a chat card
  (items).
- Never patches a directory, a sheet or the sidebar class; the tab rules mark Foundry's own `gmOnly` and remove
  buttons, as House Rules does today.
- Never touches Clue Board, its button or its data.

## How it is built

- **Phase 1, the fold**: the shell (the window, the case switcher, the takeovers, Classic Mode, the finder, the
  record, the look), the journal case ported from Scroll Case 1.0.4 with its tests and its live walk, the scenes case
  from Map Case, the tab rules from House Rules. Released only once Scroll Case's own live walk passes against it
  unchanged in meaning (43 checks), Map Case's (27) and House Rules' sidebar walk.
- **Phase 2, actors and items**, after the user's rulings (Q1, Q2), each with its own walk. Phase 1 can go to prod
  and retire Scroll Case without waiting for it.
- **Tooling**: the template's (Biome, Vitest, `verify.yml`, `release.yml`, the kit, `lang/en.json`); `scripts/decide/`
  per case, pure and tested; `scripts/cases/<case>.js` for each case's cards, actions and context, over one shared
  window. Map Case's local repo is folded in and deleted; it never had a remote.

## Decisions

Taken here, open for the user to overturn:

- **D0. A skin** (C7), as Scroll Case and Map Case are.
- **D1. One window with a case switcher**, each sidebar button opening it on its case; not four windows.
- **D2. Classic Mode per case**, so a table can keep Foundry's Actors tab and still use the journal case.
- **D3. The tab rules step aside while House Rules still has them**: install order never matters.
- **D4. Phase 1 retires Scroll Case**; actors and items are phase 2.
- **D5. The name**: `fvtt-mod-cardcatalogue`, *Open Roll 5e: Card Catalogue*; the setup screen's `getPackages` check
  is owed before the repo. Foundry's own Cards tab is a different thing (and both tab rules hide it).

## The user's rulings

1. **Actors**: Open the sheet, the chevron as proposed.
2. **Items**: Open, the chevron as proposed.
3. **The finder**: one per case, as today ("im not sure about a global find"); no Ctrl+Shift+F.
4. **House Rules 1.4.0**, a minor: yes.
5. **Scroll Case's repo**: archived or deleted once the cut-over is done.

## As built

- **Everything above, both phases at once** (the user: "go", then "run this autonomosly til i have a working draft
  on sandbox"): the shell, the journal case (Scroll Case 1.0.4's files, ported with their ids, strings and
  settings moved under the case), the scenes case (Map Case 0.1.0's), the actors and items cases (one shared window
  configured per case), the tab rules (House Rules 1.3.0's), the migration.
- **One window, as the user sees it**: each case is its own window class; the strip opens the other case where this
  one stands and closes this one, so switching looks like one window changing. The strip sits in the bar, not the
  rail (four cases with their names do not fit 15rem), in the sidebar's order, and is hidden when only one case is on.
- **The cases step aside** while the module each replaces is active (Scroll Case, Map Case), as the tab rules do
  for House Rules: two windows never answer one button.
- **Actors' views**: All, On this scene (GM), Mine (a player), then the types; a player's Mine includes the party
  group they own. **Items' Give to…** lists the primary party, its members and every player's assigned character.
  Actors' and items' finders are unbound by default (Ctrl+Shift+A and Ctrl+Shift+I are the browser's).
- **House Rules 1.4.0** on `main` (uncommitted): the two rules, their file, tests and strings out; the README and
  CHANGELOG point here.
- **Walked GREEN on the sandbox**: `journal-check.mjs --walk` 43 (Scroll Case's walk, ported unchanged in meaning),
  `scenes-check.mjs --walk` 27 (Map Case's), `docs-check.mjs` 25 (actors, items, the strip, a player, the
  carried-over settings, the tabs hidden by Card Catalogue once House Rules 1.4.0 runs).
- **After the draft, on the user's word**: the scenes card's one button is **View**, not Activate (Activate heads
  the chevron and sits in the panel); the actors case sorts by type, then name; every panel has an × and Escape
  closes it first; Undo of an activation brings the GM's own canvas back too once it is idle (Foundry refuses a
  move mid-draw); a summoned creature (dnd5e's `isAutoImported` copy) is no card in a player's actors case, though
  they own it (the Owl, Tychon's familiar, showed for Tom).
- **The name is free** (D5): the setup screen's `getPackages`, 7,087 modules, has no "Card Catalogue", no
  `cardcatalog` and no "catalogue" at all.
- **The repo**: `Txpple/fvtt-mod-cardcatalogue`, public, `verify` green; in `repos.json` without a blurb.
- **Open**: the releases (Card Catalogue 0.1.0 or
  1.0.0, House Rules 1.4.0) and the prod cut-over; Scroll Case's repo archived or deleted after; Map Case's local
  folder (`fvtt-mod-mapcase`, disabled on the sandbox) deleted; the suite's rule that Clue Board copies Scroll Case's
  look pointed here; the integration map and catalogue regenerated once it is in `repos.json`.
