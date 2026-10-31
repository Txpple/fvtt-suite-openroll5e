# Plan — Clue Board, a new Open Roll 5e module

**PHASE 1 BUILT 2026-10-29** as `fvtt-mod-clueboard` 0.1.0 on `main`, unreleased, deployed to the sandbox (mirrored from
prod the same night) and walked there by its `tools/live-check.mjs` (a GM page and a temporary player page; GREEN: the
Clue type, the Read column, the gather with its stamp, the tab after Journal, the holder following a move). The sandbox's
Session 02 documents are Clues, three of them gathered (Kartor read the letter and the key, Cecil the letter and the
ledger). The decisions below stand as written; what the build changed: the stamp skips the stock calendar's date (a world
with no calendar would stamp "0000-01-01"), and the Clue page type is registered whether or not the module is enabled.
**Revised the next morning on the user's word** ("no sidebar panel, totally broke the ui"): the sidebar tab stuck the
sidebar, so Mysteries is a window of its own opened centred from a scroll button on the strip after Journal, never a
sidebar panel (D8 below, revised). **And the same morning**: the journal underneath was "messy, and not
encapsulated", so a party's record moved onto its Group actor, the module's own data behind its own schema, with
no journal, folder or document type (D1 and D4 revised); and there are no GM secrets, in phase 1 or after: the DM's
overlay is gone from phase 2. **And then, the same day** (C12): the stash was going to be "wayyyy too busy ... confusing the
party between loot they can sell and clues", so the Clue is an item type of the module's own that is never carried,
collecting is the DM's act and fills Mysteries at once, and the read is marked when a player opens the card; the
Read column, the loot subtype, held-by and the Party Stash logic are gone (D2, D3, D7, D9 revised, the phase 1
section rewritten). The sandbox's ten Session 02 documents became Clues built from the world originals (the DM's
prototypes, which carry the corrected found-at lines; the stash copies never did), their readers kept.

Drafted 2026-10-28 from the brief ("a clue board, in game, probably an optional module ... tie it to items ...
connect / move items from party stash ... clues are gathered Call of Cthulhu style, read the items") and the case
that asked for it: *Echoes of Halruaa* after session 02, where the party read nine documents in one house and the
DM's clue map (`plot/plot.md` §4, five pieces, each in three places) is kept by hand. Cut down on 2026-10-29 on the
user's word: **phase 1 is three things, the Clue loot type, Read and the Mysteries tab**; everything else moved to
phase 2. The
repo `fvtt-mod-clueboard` is scaffolded from the template with this plan; **nothing here is built.** The decisions it
needs are at the end, the open ones marked.

## The brief, as contours

| # | The brief | What it asks of the module |
| --- | --- | --- |
| C1 | "a clue board somehow, in game, probably an optional module" | a module in the family's shape: installs alone, detection never `requires`, off leaves the world as Foundry has it |
| C2 | "have it tie to items" | a clue is a Foundry Item first: the letter, the ledger, the key, the shoe. The card opens the item; the item knows it is a clue |
| C3 | "connect / move items from party stash" | a clue in the group inventory is everyone's to read; when Take, Stash or Give moves it, the card follows the holder |
| C4 | "clues are gathered Call of Cthulhu style (read the items)" | nothing is on the board that nobody read. Reading is the gesture that gathers, and the record says who read it, where and when |
| C5 | "what features would make it useful for players" | the players' own tool: a place they can reread, threads they name, leads they write, a timeline for a case built of dates; no DM structure leaks |
| C6 | "maybe there's something out there already" | the field surveyed below; the board itself may be another module's, the gathering is ours |
| C7 | "even more simple for phase 1: no DM screen, only the clue tags, read, and casefile" (2026-10-29) | phase 1 is the Clue type on an item, Read on rows and cards, and one window off a sidebar tab; the DM's overlay, the export, testimony and observation wait |
| C10 | "add a new loot type called Clue and we'll use that as the signifier if a loot is a clue or not" (2026-10-29) | no flag, no tag UI: a `clue` entry in dnd5e's `CONFIG.DND5E.lootTypes`, set in the item sheet's own type field; a loot item of type Clue is a clue |
| C11 | "the read button only when something is in party stash, I don't want to mess with player inventories yet ... that will be the only trigger to put something in the mystery box, for now" (2026-10-29) | Read on the group sheet's rows and nowhere else; the stash's Read is the one way into Mysteries; character sheets, cards and item sheets untouched |
| C12 | "remove the Read button on party inventory; remove the clue loot subtype; a full new item subtype for clues, they should not appear in party stash inventory; a clue is marked Read when opened by a player in the Mysteries board; clues collected auto-populate the board" (2026-10-29) | a Clue item type of the module's own, never carried; the DM collects (a drop, a button) and Mysteries fills itself; the read is marked on opening; nothing in any inventory |
| C13 | "players are going to want to organize these clues ... tabs or kanban like things, where they can name, and then drag cards ... shared ... gm can also rearrange ... threads all the way ... clues can go in each one multiple times" (2026-10-29) | threads: a tab per named question, a clue pinnable to many, drag to pin and to order, a stand line per thread, any owner organises |
| C8 | "a sidebar menu item placed directly after Journal that opens the case file screen" | a sidebar tab of the module's own, between Journal and Tables, that opens the window; not a journal sheet |
| C9 | "a name that's fantasy, not Call of Cthulhu: Lore? mysteries? something thematic" | **Mysteries**: the tab, the window, and in phase 2 the threads the players name |

## The names

**`fvtt-mod-clueboard`, title `Open Roll 5e: Clue Board`**, package id = repo name (no hyphen in the name part).
First pass on foundryvtt.com (2026-10-28): the package pages `clueboard` and `clue-board` are 404. The neighbours are
**Clues Kit** (`clue-cards`), **ClueBook**, **Conspiracy Board** and **Sargas Investigation Board**; none shares the
title. **The definitive check is the setup screen's `getPackages` with no world active** (the suite CLAUDE.md,
*Names*); it is owed before the first release, not before the repo. Fallbacks if it finds a clash: Case File, Evidence.

**The window is Mysteries** (ruled 2026-10-29 from three: *Mysteries*, the clearest to a player and the word phase 2's
threads take; *Commonplace Book*, the medieval book you copy passages into as you read them, the most thematic and the
least known; *Findings*, plain). In the module's own words: a **clue** is one thing the party knows because they read
it. A clue has a **source** (the Item), **readers** (the characters who gathered it, in order), a **holder** (the
actor whose inventory carries the item today, or *left the party*) and a **found-in** stamp (scene, calendar date,
real date). A **Clue** is a loot item of the Clue type, the GM's one signifier (C10). The clues fill **Mysteries**,
the window the sidebar tab opens.
Phase 2 adds the **board**: cards, **strings**, **leads** (notes the players write), **mysteries** the players name
(a thread, in a generic board's words), the **timeline**, and the DM's **pieces** and **nudge**.

## What the field offers

| Module | What it is | What it lacks for this table |
| --- | --- | --- |
| [Sargas Investigation Board](https://github.com/sargas79/sargas-investigation-board) (MIT, v14) | a corkboard; a case is a flagged JournalEntry, every clue and string a page of a module sub-type; players drag an Actor, Item or Scene from the sidebar and it pins as a card linking the original; leads as sticky notes, strings coloured by pin, GM redaction, handouts to named players, JSON export | early-stage (no stars, an id change at 1.0.1); nothing knows a clue was *read*, by whom or where; a dropped Item pins its uuid, which a Party Stash move changes |
| [Conspiracy Board](https://github.com/Darthjebus211/Conspiracy-Board) (v14, 2.10.2) | a board in the scene drawing tools: typed clues, strings with sag, actors as portrait pins | clues are typed text, not documents; player edits route through a GM client, so a GM must be online |
| [Clues Kit](https://foundryvtt.com/packages/clue-cards) (paid, v13/14) | the Call of Cthulhu feel: a GM clue library with reveal levels, an animated delivery to a player, a private deck per player, a shared corkboard, GM–player messages | paid through Patreon, no repository; the GM authors clues as cards, nothing ties to the Items the party actually carries |
| [ClueBook](https://foundryvtt.com/packages/ClueBook) (v13/14, 2.0.1) | notes, quests, a detective board, @-links to documents, a calendar | a GM organiser more than a player board; no gathering, no item tie |

**The gap is the gathering.** Every board above holds what someone typed or dragged. None knows that Kartor read
the letter in the attic on 29 Tarsakh with Cecil looking over his shoulder, that the letter is in the stash, or
that it left the party when he handed it to Sadric. That is the layer this module owns. The board on top may be
ours or Sargas's (phase 2).

## The idea in one line

**A clue is a view onto a document the party has read.** The module never holds text the DM typed for the players'
eyes; it holds what the players gathered, stamped. Everything else hangs off that record.

## Phase 1: the Clue, collecting, Mysteries

The third shape of 2026-10-29, on the user's rulings (C12): no Read in any inventory, no loot subtype, a Clue type
of the module's own that never appears in a stash, collected clues in Mysteries at once, the read marked when a
player opens the card. Proposal A of `prototypes/clue-management.html` ("code wise, A seems the most elegant and
non-invasive, self encapsulated"), documents first.

### The Clue

- **An item type of the module's own**, `fvtt-mod-clueboard.clue`, declared in `module.json`. Foundry lists it in
  the Create Item dialog as "Clue" beside dnd5e's types, with an icon from `CONFIG.DND5E.defaultArtwork.Item`.
- Its data is ours: `kind` (document; testimony and observation are phase 2 values, the seam the user asked for),
  `text` (HTML), `foundAt` (the DM's words, optional). No price, weight, quantity, rarity or activity.
- Its sheet is ours: image, name, the kind, Found at, the text in the editor, and a footer with *Collected by
  <party>, read by ...* and *Take back*, or *Collect for <party>* (one button per party).
- **A Clue is never carried.** dnd5e refuses a non-physical item on a Group (`Item5e._preCreate`); the module turns a
  Clue dropped on any actor's sheet into a collect (`dropActorSheetData`, returning false) and refuses one created
  inside any actor by another path (`preCreateItem`). Nothing of the module's touches an inventory, a character
  sheet or an item card.

### Collecting

- The DM's act, five ways: a drop on the Party sheet, on a member's sheet (their party), or on the Mysteries window;
  Collect on the Clue's sheet; Collect in the GM strip at the top of Mysteries, which lists every world Clue no
  party has. A compendium Clue is imported into the world first (a "Clues" folder) so the entry has a master.
- Collecting stamps **found-in** (the scene the table is viewing, the calendar date when the world has one, the
  real date) and **snapshots** the Clue (name, image, text, found-at, kind, revision 1). The snapshot is what the
  entry shows; an edit to the Clue re-snapshots every party's copy and marks the revision; a deleted Clue freezes it.
- **Take back** (the sheet, or the x on a card, GM only) removes the entry; the Clue stays in the world.
- The party: the group dropped on, else the group the member belongs to, else dnd5e's primary party, else the only
  party, else the DM picks.

### Mysteries

- **A spy button (`fa-user-secret`, the user's pick) on the sidebar's strip, directly after Journal, that opens Mysteries as a window in the middle
  of the screen**, like FX Studio's. Built first as a sidebar tab (`Sidebar.TABS` and `CONFIG.ui`), whose panel
  stuck the sidebar on the sandbox; the user ruled it out the next morning. The button is not a tab: the sidebar
  never switches or expands for it, and nothing of the module's is drawn inside the sidebar.
- **The window** lists what the party has: one card per Clue with its image, name, an excerpt, the found-at line,
  the scene, the readers; a search; the count of what the player has not read (the GM: what nobody has). For the
  GM, the strip of uncollected Clues and a drop target. A click opens the **Reader**: the text as a document, the
  stamp, the readers, the kind, the party's note (any owner writes it), *Open the Clue* when the user may see it.
  **It never posts to chat.**
- **Opening a card as a player marks the read** for their character (the user's own, else the one member they own,
  else their pick), once; a GM's opening marks nothing. That is the one way a read gets marked.
- **The record lives on the party's Group actor**, in the module's flags, behind the module's own schema
  (`MysteryEntry`, versioned): nothing in a directory or on a sheet. The players own the party (Party Stash needs
  it too), so a read lands with no GM online. Every write names the narrowest key, so two writes at once never
  collide. No party, no record. (Built first as a journal per party with a page type; the user ruled it out as
  messy and leaky in the UI.)

### Threads (C13)

- The user, after the ten clues were on the board: "players are going to want to organize these clues ... tabs or
  kanban like things, where they can name, and then drag cards"; shared, the GM may rearrange; of the four formats
  proposed (lanes, threads with tags, the corkboard with strings, questions and theories) the ruling was "threads
  all the way ... clues can go in each one multiple times".
- **A thread** is a named question or line of inquiry with a colour, open or answered, and a short *Where we
  stand*: the party's theory on it. It is a tab in Mysteries beside *All* and *Unassigned* (what no thread holds).
- **Pinning** is a drag of a card onto the tab; a clue may be in any number of threads and wears a dot per thread;
  inside a thread a card dragged onto another goes before it. Unpin is a button on the card in that thread.
- **Anyone who owns the party organises**, the GM included; deleting a thread asks, unpins its clues and loses
  nothing else. Threads live on the party beside its entries; pins live on the entry, so an entry gone takes its
  pins with it.
- Precedents: the GUMSHOE games' leads, *L.A. Noire*'s notebook, *Brindlewood Bay*'s Theorize for the stand line.
  Phase 2's strings can run between cards inside a thread if the table wants the wall.

### Settings

| Setting | Default | What it does |
| --- | --- | --- |
| Enabled | on | Off leaves the sidebar as Foundry has it and collects nothing; the type, the Clues and the records stay. |

### What it never does

- Writes nothing to chat, ever. Posts no receipt; a collect is not a transfer.
- Puts nothing in an inventory, and nothing on a character sheet, an item card or a dnd5e item sheet.
- Never patches a class: the type is a declaration, the drops are hooks, the button is a DOM addition.
- Hides nothing from the players: no GM secrets, in any phase.

## Phase 2: the board

- **Read everywhere**: character sheet rows (beside Party Stash's Stash and Give, its column template taking a
  `read` boolean), item chat cards (dnd5e's and By the Books', whose "read" posts today), and the item sheet's
  header; each a trigger into Mysteries like the stash's.
- **The board**, a second view in Mysteries: the clues as cards on a cork ground, free placement, **strings**
  between cards, **leads** (sticky notes the players write, with an author), **mysteries the players name** (a colour
  and a name for a set of cards, free to be wrong), and the **timeline**: every card with a date the players set on it
  ("the ledger's last line: 29 Tarsakh 1385") drops onto a strip, since this case is a chronology.
- **The Sargas trial first.** Before building a board, install Sargas Investigation Board on the sandbox, drag
  session 02's nine documents onto a case, and let the table use it for a session or two. If it earns its place, keep
  it and let Clue Board **feed** it: a gathered clue pins itself to the Sargas case as the linked Item card (its data
  model is a journal with sub-type pages). Build our own board only if the table wants the
  timeline, the read-stamps on the cards or the holder badge badly enough. Its license is MIT; a fork into the family
  would keep its attribution and its author's name in the README.
- **No GM secrets** (the user, 2026-10-29): no DM overlay, no hidden pieces or hints. The DM's clue map stays in the
  campaign repo.
- **Testimony and observation**: clues that are not items, gathered by the GM by hand from an actor (*Gather
  testimony*), a Clue heirloom (*Gather observation*: "the chalk glows constantly here") or a chat message.
- **Reveal on a roll**: a History DC 15 that lands attaches the Keeper's revealed line to the entry for all readers.
- **The export**: *Documents Found* as Markdown from Mysteries (the title line, the found-in line, the snapshot as a
  blockquote, the readers), to the clipboard and a GM whisper; the Session Scribe reads the party's record through the
  bridge and builds a *Case so far* page. It copies no documents into the session record: the board is where found
  documents live, and the recap and Session Diary carry no appendix of them (DM, 2026-10-30). A contract, `contracts/case.json`, versioned here, consumed by `fvtt-mcp-sessionscribe`.
- **The MCP's `manage-clues`**: list, set the Clue type in bulk, export the case.

## How it fits the family

- **Installs and works alone.** Party Stash, Loot Shelf, By the Books and the Session Scribe are detected or absent.
  With Party Stash: the Read column sits beside Take on the group sheet (in Take's cell if Party Stash's
  `take-column.hbs` takes a `read` boolean, the way its stash column took `give`; else its own column after it);
  without Party Stash, Clue Board's column stands alone. By the Books' item cards keep their own "read" until phase
  2 (its fix list, session 02 §16).
- **One client acts** is not needed: every write is the reader's own, on a party the players own, so a GM absent
  loses nothing (Party Stash's lesson, 2026-09-30). The kit's `elect.js` is carried unused.
- **Hooks**: `clueboard.gathered`, `clueboard.changed`. **Contract**: `contracts/case.json`, version 1, with no
  consumer until phase 2's export.
- **The MCP** gets nothing in phase 1; `get-world-info` names Clue Board among the house modules when it is released.
- **Tooling**: the template's (Biome pinned to the family's 2.5.15, Vitest, `verify.yml`, `release.yml`, the kit,
  `lang/en.json`). Pure modules under `scripts/decide/` for everything that needs no Foundry: the holder resolution,
  the snapshot diff, the record as a list; Foundry-facing code under `scripts/`.

## The data

```
CONFIG.DND5E.lootTypes.clue = { label: "Clue" }                  // at init; the signifier is system.type.value
Item.flags["fvtt-mod-clueboard"].id                               // written at the first gather

Actor (type group).flags["fvtt-mod-clueboard"]                    // the party's record, MysteryEntry per clue
  schema: 1
  entries: {
    <clueId>: {
      id,
      source: { uuid, name },
      snapshot: { name, img, html, revision, at },
      foundIn: { sceneId, sceneName, calendarDate, realDate },
      readers: { <actorId>: { actorId, actorName, userId, at } },
      holder: { actorId, actorName, left, lastHolder, at },
      notes: ""
    }
  }
```

Phase 2 adds `kind` (document, testimony, observation).

## Halruaa, worked

Session 02's documents, as phase 1 would have recorded them. Every one is a loot Item in the `Session 02` folders
today; setting their type to Clue makes them clues (nine edits, or one `manage-items` call).

| Clue | Readers (as played) | Holder today | A mystery the players might name |
| --- | --- | --- | --- |
| Ysolde's Key | Lysandra, then all | the stash | the scouts' road |
| Brann's Tally | all (eleven clicks) | the stash | the scouts |
| Durgan's Unfinished Letter | Kartor, aloud | the stash; to Sadric in session 03 (*left the party*) | Durgan |
| The Wayhouse Ledger | Cecil | the house | Durgan; the dates |
| The Lodging Board | all | the house (a wall) | Durgan; the lady in grey |
| The Lady's Parcel | Cecil | the stash | the lady in grey |
| The Lost-Familiar Notice | Tychon | the house | Mirri |
| Spell Scrolls: Silence, See Invisibility | Tychon | Tychon | the lady in grey |
| The Luck Shoe | all, no roll | the house | the mark over the Door |

## Decisions

Taken here, open for the user to overturn:

- **D1. Who writes, and where.** The reader's own client, on the party's Group actor, which the players own;
  never the elect. A GM absent loses nothing; a player could vandalise the record through the console, which a
  table that trusts its players accepts. (Revised 2026-10-29: a journal per party was built first and ruled out.)
- **D2. A Clue is an item type of the module's own** (C12, replacing C10's loot subtype): `fvtt-mod-clueboard.clue`,
  with its own data, sheet and icon, never carried. **The identity is the world Clue's id**: the entry is keyed by
  the item it was collected from, and the item is the DM's master the entry follows.
- **D3. Collecting is the DM's act; reading is the player's mark** (C12). Nothing is read into Mysteries; the DM
  puts a Clue there, and a player's opening of the card marks that they read it. Rations never come near it.
- **D4. One record per party** (Group actor), kept on it; no party, no record. A table with two groups has two.
- **D5. Snapshot at gather, re-snapshot while held.** The entry shows what the party read, and what the DM later
  revealed on the same item, with the revision visible; a lost item freezes.
- **D6. The names.** Clue Board, free on foundryvtt.com's package pages on this pass, the setup-screen check owed
  before the first release; Mysteries for the tab and the window (C9).
- **D7. Phase 1 is three things** (C7, C8, C12): the Clue, collecting, the Mysteries window.
- **D9. Nothing in any inventory** (C11 then C12): no Read column, no bookmark, no Clue in a stash or a bag;
  character sheets, item cards and dnd5e item sheets untouched. Testimony, observation (as kinds of Clue), the
  export, the MCP tool and the board are phase 2; the Sargas trial comes before any board of ours.
- **D8. A window off a button on the sidebar's strip, not a sidebar panel and not a journal sheet** (C8, revised
  2026-10-29 on the user's word after the panel stuck the sidebar).

## Open questions for the user

1. The Clue's default artwork: the sealed red-and-tan letter for now; a drawn icon of our own later?
