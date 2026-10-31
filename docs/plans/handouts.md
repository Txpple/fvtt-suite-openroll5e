# Plan — Handouts, a new Open Roll 5e module

**PHASE 1 BUILT 2026-10-30** as `fvtt-mod-handouts` 0.1.0, local only (no GitHub repo, nothing committed, not in
`repos.json`), deployed to the sandbox and walked GREEN by its `tools/live-check.mjs --walk`, after two adversarial
review passes and a third on Playwright screenshots (*As built*, at the end, says what the build changed). Drafted the
same day from the brief, with the investigation (Foundry 14.369's journal
model and its Show mechanics, read from the install; the sandbox's journals and asset folders, mirrored from prod the
same day) and the clickable prototypes (a private design canvas, not in this repo: they carry the campaign's art).
**Shaped the same day by the user's ruling** (C6): a skin over the journal and nothing else, so it can be switched
off with nothing broken; the module keeps no data of its own in the world. The decisions it needs are at the end.

## The brief, as contours

| # | The brief | What it asks of the module |
| --- | --- | --- |
| C1 | "a handout manager similar to the clueboard UI" | a window of cards with a rail, like Mysteries: thumbnails, a search across the top, views and the journals on the left |
| C2 | "share with players at the click of a button" | Show on every card, one click, to everyone online; who and how behind a chevron, never a modal first |
| C3 | "organize them in folders much like clueboard tags" | the journal's own sorting drawn like Mysteries' rail: folders, journals and the sections inside a journal, a card dropped on a section to file it |
| C4 | "ESPECIALLY quickly finding a picture" | a search over everything a picture is known by (name, caption, section, journal, folder, file name, page text), a keyboard finder, thumbnails at a glance, and the image files no page holds yet |
| C5 | "can the journal UI be changed but keep the essential data structures?" | yes: the module reads and writes Foundry's own journals and nothing else |
| C6 | "just a diff ui skin over journals, no data struct change, so we can turn it on or off and nothing breaks, but just much better UI" | no flag, no setting value, no document of its own: every world write is one the stock journal makes itself; what only the module needs (pins, *Recently shown*, *New*) lives in the browser |

## What the journal is today (Foundry 14.369)

- **`JournalEntry`**: `name`, `pages`, `folder`, `categories` (v13+: named sections inside one entry), `sort`,
  `ownership`, `flags`. Entries sit in the sidebar's **Folders** (nested, coloured).
- **`JournalEntryPage`**, the unit a player sees: `name`, `type` (`text`, `image`, `pdf`, `video`, and dnd5e's
  `class`, `subclass`, `map`, `rule`, `spells`), `src` (the file of an image, PDF or video page), `image.caption`,
  `text.content` (HTML), `category` (its section), `sort`, `ownership` (default *inherit* from the entry), `flags`. A
  page lives inside its entry: it cannot move to another entry, only be copied and deleted, which changes its uuid
  and breaks every `@UUID` link to it.
- **Sharing is two separate things.** *Visible*: the page's (or entry's) ownership, Observer or better, which lasts.
  *Shown*: `Journal.show(doc, { force, users })` emits `showEntry`, and each recipient's client opens the sheet on that
  page, granting itself Observer in memory only; `Journal.showImage(src, { users, title, caption, uuid })` emits
  `shareImage`, and each recipient gets an image popout with no document at all. The stock *Show Players* button
  opens a modal (everyone or ticked players, an optional ownership change, image-only, title, caption) before
  anything is sent. Foundry records no history of what was shown.
- **Search**: the Journal directory matches entry names, or names and page text in full-text mode. There is no
  thumbnail view, nothing searches a caption or a file name, and an image embedded in a text page (the Bestiary's
  portraits) is found only by remembering which page holds it.

## Halruaa, today

Eight journals in four folders (*Adventure Log*, *GM Notes*, *02 - The Blight › Session 02*): *Player Handouts* (two
image pages, both visible), *Session 02 Illustrations* (three image pages, GM-only), *Map Keys* (the maze image and
four GM text pages), *Bestiary* (six text pages, visible, each opening on a portrait), *Session Diary* (three, visible),
*Player Backstories*, *Scene Switches* (GM), Sequencer's database. No journal uses sections yet. The files:
`assets/handouts/` holds three images, two on pages and *Tychon in the Apprentice's Robe* on none;
`assets/journal/blight-illustrations/` four, three on pages; `assets/maps/` and `assets/portraits/` dozens, shown only
through scenes and sheets. Finding *the* picture of Ysolde means knowing it is a portrait file, not a page.

## The ways to change the journal

| | What | For | Against |
| --- | --- | --- | --- |
| A | **Replace the journal sheet** (Monk's Enhanced Journal's route: its own sheet classes and entry types) | one place for everything | the heaviest kind of patch; every Foundry release reshapes the sheets (MEJ is still verified on 13); fights dnd5e's page sheets; its data in its own shapes, so off is not clean |
| B | **A window of our own over the same documents** (Clue Board's route) | the stock journal untouched; off leaves the world exactly as Foundry has it; the data is Foundry's own | a second place to look (the window links back to the stock sheet for editing) |
| C | **Restyle the Journal sidebar** (a thumbnail grid in the directory) | where the DM already looks | the sidebar is 300 px wide; Clue Board's sidebar panel stuck the sidebar |

**B**, and C6 makes it a skin in the strict sense. The stock sheet stays the editor; the window is where the DM
finds, files and shows, and where a player finds what they have been shown. The neighbours (Quick Scenes &
Handouts, Nik's Show & Tell, Share Media, Handout Ping Viewer, Gambit's Image Viewer) each improve one gesture, a
right-click Show or a better popout; none is a library, and none searches.

## The idea in one line

**A handout is a journal page, and showing it is one click.** The module draws Foundry's journal as cards and makes
only the writes the stock journal makes; it never copies, moves or annotates a page.

## Phase 1

### The window

- **Handouts**, a window of its own, centred, one per client: a button on the sidebar's strip after Journal (after
  Mysteries' when Clue Board is on), a button in the Journal directory's header, and a keybinding.
- **The search across the top** matches a page's name, caption, section, journal, folder, file name and text, and
  says where it matched (*in file name*, *in text*). A type filter (Images, Text, PDF, Video) and a card size.
- **The rail** (Clue Board's layout A): *All*, *Visible to players*, *GM only*, *Recently shown*, *Pinned*, *Not on a
  page*; then the journals by folder, each with its sections, each a filter.
- **A card per page**: the image of an image page; for a text page, the first image in its text (the Bestiary's
  portraits), else its first lines; the name, the journal and section, a badge for who can see it, a pin when
  pinned. A page no player can see is drawn dimmer for the GM.
- **The detail panel** beside the cards when one is picked: the picture large, where it lives (folder › journal ›
  section › page, and the file), its section, *Players can see* (everyone, or per player), the last time this
  browser showed it and to whom, *Pin*, *Open in journal* (the stock sheet, for editing), *Copy link* (its `@UUID`).

### Show

- **Show** on every card, on hover, and in the detail panel: one click shows the page to everyone online through
  Foundry's own `Journal.show` (an image page as the image popout) and, by default, sets the page to Observer for
  all players so it stays in their Handouts (the stock dialog's own ownership write). The toast says what happened.
- **The chevron** beside it opens the options in place, not a modal: everyone or picked players (online marked),
  *Keep it in their Handouts* (on: the ownership write; off: shown once, nothing written), title and caption for an
  image.
- **A file on no page** is shown with `Journal.showImage`, writing nothing; *Keep as a handout* makes a plain image
  page for it in a journal the setting names (default *Handouts*, made on first use): a page like any the stock
  sheet makes.

### Sorting: the journal's own

- **Folders, journals and sections**, drawn in the rail with their counts. A card dropped on a section of its own
  journal sets the page's `category`, as the stock sheet does; the detail panel's section picker does the same.
- **No move across journals**: a page's uuid would change and every link to it break, so the window never offers it;
  dropping on another journal says so. A journal moves between folders in the stock directory, as today.
- **Pins** are the many-to-one shortlist (the next session's handouts): a pin on any card, the *Pinned* view, kept
  in this browser only.

### Finding

- **The finder**: the keybinding opens a search box over the table; empty, it lists the pins and *Recently shown*;
  typing narrows to everything with thumbnails, the arrows move, **Enter shows the pick to everyone**, Shift+Enter
  opens the options, Ctrl+Enter opens it in the journal, Escape closes. From "the picture of the maze" to the
  players' screens: three keys and a word.
- **Not on a page**: the image files under the asset folders the setting names (default the world's
  `assets/handouts`, `assets/journal`, `assets/maps`, `assets/portraits`), read through the FilePicker's browse,
  less those a page already uses. Searchable by file name and folder like everything else.

### The player's window

- The same button opens it for a player: what they can see, *Recently shown* first, the journals as the rail, the
  unopened glowing (Clue Board's unread edge). Opening a card opens the stock sheet or the popout.
- When the DM shows one, it arrives as Foundry shows it today (the popout or the sheet) and sits at the top of
  *Recently shown*: the player's client hears the same `showEntry` and `shareImage` events Foundry sends, and
  remembers them in the browser.
- *New* is per browser: what this browser has not opened. A player on a second machine sees it new again.

### What lives where

| What | Where | Off, or another browser |
| --- | --- | --- |
| Who can see a page | the page's `ownership` (Foundry's) | unchanged; the stock journal shows the same |
| A page's section | the page's `category` (Foundry's) | unchanged |
| A kept file | a new image page (Foundry's) | an ordinary page |
| Pins, *Recently shown*, *New*, the last view and size | the browser's storage | gone with the browser; nothing in the world to clean |
| The four settings | client and world settings, the module's own keys | Foundry ignores a disabled module's settings |

### Settings

| Setting | Default | What it does |
| --- | --- | --- |
| Enabled | on | Off: no button, no window, no keybinding; the journals as Foundry has them |
| Show keeps it visible | on | Show's default for *Keep it in their Handouts* |
| Asset folders | the four above | where *Not on a page* looks |
| Handouts journal | *Handouts* | where *Keep as a handout* puts a new image page |

### What it never does

- Never writes a flag, a field or a document of its own; every world write is one the stock journal makes (C6).
- Never replaces or patches a journal sheet, the directory or a page class; no libWrapper, no socket of its own.
- Never copies, moves or deletes a page; never writes a page's text, image or caption (the stock sheet does).
- Never posts to chat.

## Phase 2

- Several cards picked at once: show, hide, file into a section.
- A card dragged onto the canvas (a tile or a note), onto chat (a link), onto an actor (its art).
- The MCP's `manage-handouts`: list, file, set visible, show; prep fills a *Next session* section from the plan file.
- With Clue Board on: *Make a Clue from this* on a text page (a letter is both a handout and a clue).
- Anything shared across browsers (pins the whole table sees, a show history for the Session Scribe) would need
  world data, so it waits on the user overturning C6 for it, one named exception at a time.

## How it fits the family

- **Installs and works alone**: Clue Board detected only for the button's place and phase 2's bridge.
- **One client acts** is not needed: only the DM's client writes, and only ownership, a section and a kept page;
  a player's client writes nothing to the world.
- **Hooks**: `handouts.shown(page, users)` on the showing client. Nothing listens yet.
- **Tooling**: the template's (Biome, Vitest, `verify.yml`, `release.yml`, the kit, `lang/en.json`); `scripts/decide/`
  for the search, the card's picture, the filters and the *New* count, tested without Foundry.

## Decisions

Taken here, open for the user to overturn:

- **D0. A skin** (C6): no data of its own in the world; switching it off leaves every journal exactly as the stock
  journal wrote it.
- **D1. Route B**: a window of our own over Foundry's journal; the stock sheet stays the editor.
- **D2. A handout is any journal page.** No marking step: every page is in the window, *Visible to players* and *GM
  only* split them.
- **D3. Show is one click to everyone online**, keeping it visible by default (the setting); the options are a
  chevron, never a modal first.
- **D4. The journal's own sorting** (C3, C6): folders, journals and sections; a drop on a section sets `category`;
  pins in the browser are the shortlist. Many-to-many tags were drawn first and dropped for C6: they need a flag.
- **D5. Phase 1 includes the player's window and *Not on a page*** (C4: the picture may be a file no page holds yet).
- **D6. The name**: `fvtt-mod-handouts`, *Open Roll 5e: Handouts*; the setup screen's `getPackages` check is owed
  before the repo.

## Open questions for the user

1. The finder's key: Ctrl+Shift+H, or unbound until the DM picks one?
2. Pins and *Recently shown* in the browser only: enough, or is a shared list worth one named exception to C6?
3. *Recently shown* for a player: everything shown to them, or only what was kept visible?

## As built

The decisions above stand; what the build and its three review passes changed:

- **The Journal button**: intercepted on the button itself for a click and a middle click (the sidebar acts on
  both); a right-click is still Foundry's popout. If the window fails to open, the stock Journal tab opens instead.
  Classic Mode is also a client setting.
- **Show says what it will do**: *Show*, *Reveal* (the page is not yet visible to every player and the setting keeps
  it), *Add & show* (a picture not in a journal). A reveal leaves a strip at the top of the cards, "“Name” is now
  visible to all players. Undo": Undo puts the page's ownership back, and refuses when the page has changed since
  (another GM, the stock dialog). The revealed card stays in view until the DM moves on. A double click shows once.
- **Show the picture** (a text page with an image, such as a bestiary portrait): the picture alone as a popout; the
  page's ownership is never touched.
- **Who can see it** writes only the players whose visibility changes; a page that already inherits what is wanted
  keeps inheriting. Writes on one page are queued. Banned users are not players.
- **Players never read a GM secret**: a card's text, picture and search come from the page with its unrevealed
  secret sections removed, and a journal hidden from a player shows neither its name nor its folder.
- **Names**: *Not in a journal* (the view and the badge), *Add to the Handouts journal* (a kept picture's page is
  created GM only, whatever the journal lets players see), the *With pictures* pill (a text page with an image
  counts). The search offers "N more outside this view". *Show again* to the same players, *Mark all seen* for a
  player, a pin on each card, "/" for the search.
- **Compatibility**: minimum 14 (the ownership write uses v14's `_replace`).
- **Tools**: `tools/live-check.mjs --walk` (40 checks: the takeover, the search, the writes on a scratch journal, a
  temporary player's view, a Show reaching them, Undo, Classic Mode, the finder); `tools/shots.mjs` (24 states on a
  GM page and a player page, and an audit of every card's words for markup leaks).
- **Open**: the setup-screen name check (D6); a GitHub repo and `repos.json` when the user wants it released.
