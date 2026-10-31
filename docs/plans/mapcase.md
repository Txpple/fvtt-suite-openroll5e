# Plan — Map Case, a new Open Roll 5e module

**FOLDED into Card Catalogue the same day** (`docs/plans/cardcatalogue.md`, its scenes case); never released.
**BUILT 2026-10-31 as 0.1.0, a prototype**, local only (`fvtt-mod-mapcase`, no repo, not in `repos.json`), deployed
to the sandbox and walked GREEN by its `tools/live-check.mjs --walk` (*As built*, at the end, says what the build changed). The brief, from the user after Scroll Case had been in play: "scroll case has really been a game
changer for ease of use as a gm. can we do something similar (use same UI, concepts, everything) to reskin a ui for
managing scenes. the thumbnails probably need to be diff size tho like the ones in the view. no permissions i dont
think for these, that little arrow in scroll case that says review we can do as activate default, or view and then
edit as well." Read against Foundry 14.369's scene model (`client/documents/scene.mjs`, `scene-directory.mjs`) and
the sandbox's 50 scenes, mirrored from prod.

## The brief, as contours

| # | The brief | What it asks of the module |
| --- | --- | --- |
| C1 | "use same UI, concepts, everything" | Scroll Case's window, rail, search, cards, detail panel, finder, Classic Mode and look, over scenes |
| C2 | "thumbnails ... diff size, like the ones in the view" | wide cards in the Scenes directory's shape (its thumbs are 300×100), not Scroll Case's squares |
| C3 | "no permissions" | no *Players can see*, no player's window: the Scenes tab is GM only, and so is the case |
| C4 | the chevron: "activate default, or view and then edit as well" | the card's one button is **Activate**; its chevron offers **View** and **Edit** (the stock config), then the directory's other actions |
| C5 | Scroll Case's own ruling, carried over | a skin: no flag, no document, no setting as a store; every write one the stock directory makes |

## What a scene is today (Foundry 14.369)

- **`Scene`**: `name`, `navName`, `folder` (nested, coloured), `sort`, `active` (one per world), `navigation` (on the
  players' bar), `navOrder`, `thumb` (a 300×100 webp the directory and the nav bar draw), `journal` and
  `journalEntryPage` (its notes), `playlist`, `levels` (v14: the background lives on a level, `initialLevel`), the
  grid, `environment` (darkness), and the embedded tokens, walls, lights, regions.
- **The directory's actions** (`_getEntryContextOptions`): View (`scene.view()`, this client only), Activate
  (`scene.activate()`, everyone moves), Notes (the journal sheet on its page), Preload (`game.scenes.preload(id,
  { broadcast: true })`), Toggle Navigation (`update({ navigation })`), Generate Thumbnail (`createThumbnail`, then
  `update({ thumb })`), and the document's own: Configure (the sheet), Duplicate, Export, Import, Delete.
- **Finding one** is the sidebar: a 300 px column of strips, a name filter, folders. Halruaa has 50 scenes, nine of
  them *Deep Caves (A)…(I)*, five *Townhouse* and *Burnt Watch* runs, all at the top level or a few folders.

## The idea in one line

**The case is the Scenes directory drawn as Scroll Case draws the journal, and Activate is one click.** Only the
stock directory's writes; nothing of its own in the world.

## Phase 1

### The window

- **Map Case**, Scroll Case's window: the sidebar's Scenes button opens it (intercepted on the button, as Scroll Case
  takes the Journal button; a right-click is still Foundry's popout), a keybinding, Classic Mode per client.
- **The search across the top** matches the name, the nav name, the folder, the background's file name, the notes
  journal and page, the playlist, and says where it matched. A card size.
- **The rail**: *All*, *Active and viewed*, *On the players' bar*, *Off the bar*; then the folders, nested, with their
  counts. A card dropped on a folder files the scene there (the stock drop's `folder` write).
- **A card per scene**, wide: the scene's `thumb` (C2), else the background, else its colour; the name, the folder;
  badges for **Active** (the gold edge), **You are here** (the viewed scene), on the bar, a playlist, notes. No
  ownership badge (C3).
- **The detail panel** when one is picked: the background large (its own file, full size, loaded only here), the
  size in squares and the grid, darkness, levels, the token, wall and light counts, the playlist and the notes as
  links, *Copy link* (its `@UUID`), the actions below.

### Activate, and the chevron

- **Activate** on every card on hover and in the panel: `scene.activate()`, the stock write; everyone online goes
  there. On the active scene it reads **Pull everyone here** (the stock pull). A double click activates once.
- **Undo**: the strip at the top of the cards, "“Townhouse 03” is now active. Back to “The Green”": activates the
  scene that was active before, ten minutes, refused when another scene has been activated since (Scroll Case's
  reveal Undo, for a scene).
- **The chevron** opens in place, never a modal: **View** (this client only, the players stay), **Edit** (the stock
  config sheet), **Notes**, **Preload for everyone**, **On the players' bar** (a switch), **Make the thumbnail**
  (the stock Generate Thumbnail; shown when the scene has no `thumb`, and on every scene behind the chevron).
- Duplicate, Delete and the rest stay in the stock directory, behind Classic Mode or the stock popout.

### Finding

- **The finder** (Scroll Case's): the key opens a search box; empty, it lists the pins and *Recently active*; the
  arrows move; **Enter views** the pick (safe: only the DM moves), Shift+Enter opens the chevron, Ctrl+Enter
  activates. The cards' default is Activate (C4); the keyboard's is View, so a stray Enter never moves the table.
- **Pins** (the next session's scenes) and *Recently active*, in the browser, as Scroll Case's.

### What lives where

| What | Where | Off, or another browser |
| --- | --- | --- |
| Active, on the bar, folder, thumbnail | the scene (Foundry's) | unchanged; the stock directory shows the same |
| Pins, *Recently active*, the view and size, Undo | the browser's storage | gone with the browser; nothing to clean |
| Enabled, Classic Mode | the module's settings | Foundry ignores a disabled module's settings |

### What it never does

- Never writes a flag, a field or a document of its own (C5); never patches the directory, the scene sheet or the
  navigation bar; no libWrapper, no socket.
- Never deletes, duplicates or moves a scene's contents; never touches ownership (C3).
- Draws nothing for a player: the Scenes tab is GM only, and so is the window.

## Phase 2

- Several cards picked at once: file, put on or off the bar, make thumbnails.
- *Scenes by session*: with the campaign's plan file, the MCP fills a pin list (needs a shared list: C5's exception).
- Area Sounds' set and Combat Plus's music shown on the card when those modules are on (detection only).

## How it fits the family

- **Installs and works alone**; nothing detected in phase 1. No dnd5e dependency (a scene is Foundry's).
- **The look is Scroll Case's**, a third hand copy after Clue Board's: the suite rule "a change to either's look is
  made in both" becomes all three (or the look moves into the kit as a stylesheet; see the questions).
- **Hooks**: `mapcase.activated(scene, previous)` on the GM's client. Nothing listens yet.
- **Tooling**: the template's; `scripts/decide/` for the search, the rail's filters, the card's picture and Undo's
  check, tested without Foundry; `tools/live-check.mjs --walk` on the sandbox, as Scroll Case's.

## Decisions

Taken here, open for the user to overturn:

- **D0. A skin** (C5), **route B** (a window of our own; the stock directory and sheet untouched).
- **D1. Wide cards from the scene's own `thumb`** (C2); the full background only in the panel, so 50 cards cost 50
  small webps, not 50 maps over the tunnel.
- **D2. Activate is the card's button** (C4), with an Undo; **View is the keyboard's Enter**.
- **D3. GM only** (C3): no player's window, no ownership, no permissions anywhere.
- **D4. The name**: `fvtt-mod-mapcase`, *Open Roll 5e: Map Case* (the cartographer's flat case beside Scroll Case);
  the setup screen's `getPackages` check is owed before the repo.

## Open questions for the user

1. ~~The finder's Enter~~: View (the user agreed).
2. A scene without a thumbnail: a plain tile with *Make the thumbnail* (built so; the background is heavier).
3. The look: a third hand copy (built so), or into the kit as one stylesheet the cases share? With actors and items
   to come (the user: "id like to do similar with actors and items too"), five copies argue for the kit.

## As built

- **Everything in phase 1 above**, with these changes: a double click on a card (or Enter on the picked one) views
  it, as Scroll Case's opens its page; the card's button alone activates. The panel carries View, Edit, the bar's
  switch and *Make the thumbnail* (when there is none) besides the chevron; Notes is a link in the panel. Drag a card
  onto a folder in the rail to file it (the drag carries Foundry's own `{ type: "Scene", uuid }`).
- **The chevron** is Scroll Case's options dialog over a veil, one row per action with what it does; View greys out
  on the scene you are on, the bar's row on the active scene.
- **Not built**: Scroll Case's JSON export; a player's anything (D3).
- **The finder's key**: Ctrl+Shift+M (Scroll Case's is Ctrl+Shift+H), GM only.
- **Tools**: `tools/live-check.mjs --walk [--shots <dir>]`, 27 checks on the sandbox.
- **Open**: the setup-screen name check (D4); a GitHub repo and `repos.json` when the user wants it released.
