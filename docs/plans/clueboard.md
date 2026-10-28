# Plan — Clue Board, a new Open Roll 5e module

Drafted 2026-10-28 from the brief ("a clue board, in game, probably an optional module ... tie it to items ...
connect / move items from party stash ... clues are gathered Call of Cthulhu style, read the items") and the case
that asked for it: *Echoes of Halruaa* after session 02, where the party read nine documents in one house and the
DM's clue map (`plot/plot.md` §4, five pieces, each in three places) is kept by hand. The repo
`fvtt-mod-clueboard` is scaffolded from the template with this plan; **nothing here is built.** The decisions it
needs are at the end, the open ones marked.

## The brief, as contours

| # | The brief | What it asks of the module |
| --- | --- | --- |
| C1 | "a clue board somehow, in game, probably an optional module" | a module in the family's shape: installs alone, detection never `requires`, off leaves the world as Foundry has it |
| C2 | "have it tie to items" | a clue is a Foundry Item first: the letter, the ledger, the key, the shoe. The card opens the item; the item knows it is a clue |
| C3 | "connect / move items from party stash" | a clue in the group inventory is everyone's to read; when Take, Stash or Give moves it, the card follows the holder |
| C4 | "clues are gathered Call of Cthulhu style (read the items)" | nothing is on the board that nobody read. Reading is the gesture that gathers, and the record says who read it, where and when |
| C5 | "what features would make it useful for players" | the players' own tool: a case file they can reread, threads they name, leads they write, a timeline for a case built of dates; no DM structure leaks |
| C6 | "maybe there's something out there already" | the field surveyed below; the board itself may be another module's, the gathering is ours |

## The name

**`fvtt-mod-clueboard`, title `Open Roll 5e: Clue Board`**, package id = repo name (no hyphen in the name part).
First pass on foundryvtt.com (2026-10-28): the package pages `clueboard` and `clue-board` are 404. The neighbours are
**Clues Kit** (`clue-cards`), **ClueBook**, **Conspiracy Board** and **Sargas Investigation Board**; none shares the
title. **The definitive check is the setup screen's `getPackages` with no world active** (the suite CLAUDE.md,
*Names*); it is owed before the first release, not before the repo. Fallbacks if it finds a clash: Case File, Evidence.

In the module's own words: a **clue** is one thing the party knows because they read, saw or heard it. A clue has a
**source** (an Item, an Actor, a Scene), a **kind** (document, testimony, observation), **readers** (the characters
who gathered it, in order), a **holder** (the actor whose inventory carries the item today, or *left the party*) and a
**found-in** stamp (scene, calendar date, real date). The clues make the **Case File**. The DM's private layer is the
**pieces** (the truths the clues add up to) and the **nudge**. Phase 2 adds the **board**: cards, **strings**, **leads**
(notes the players write), **threads** (groups the players name) and the **timeline**.

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
ours or Sargas's (Phase 2).

## The idea in one line

**A clue is a view onto a document the party has read.** The module never holds text the DM typed for the players'
eyes; it holds what the players gathered, stamped. Everything else (the DM's pieces, the nudge, the export) hangs off
that record.

## Phase 1: the case file

The gathering, the record, the DM's overlay, the export. No board UI. It pays off at the next session on its own.

### Read

- **A Read button** on every inventory row of a dnd5e character sheet and of a Group actor's sheet (the stash), on
  every item chat card (dnd5e's and By the Books'), and in the item sheet's header. It opens the **Reader**: the item's
  image and description as a document, nothing else of the sheet (no price, no weight, no Use). **It never posts to
  chat.** This is the fix session 02 asked for (the players clicked two cards eleven times to read them; every click
  posted).
- The Reader is read-only for players and always available: any item a user can see can be read. Reading an item that
  is not a clue is just reading; nothing is recorded.
- On the Group sheet the column sits beside Party Stash's Take when Party Stash is active (its order 1100, priority
  1000, so dnd5e hides the system's columns first); without Party Stash the Read column stands alone. On a character
  sheet it joins the Stash / Give cell the same way. Detection, never `requires`.

### Marking a clue

- **The GM marks an item as a clue** with a toggle in the item sheet's header (a bookmark). Marking writes
  `flags.fvtt-mod-clueboard.clue = { id, kind: "document" }` with a fresh random id. The id is the clue's identity
  for life: flags travel with the item through every copy the system makes, so a Party Stash move (a copy landed,
  then the source deleted) keeps it, and so does a Give through the stash.
- A folder can be marked whole (the folder context menu: *Mark folder as clues*), so a session's Item folder
  (`Session 02`, `03 - Attic`) is three clicks. A world setting, off by default, treats every item with a description
  and no activities as a clue (for tables that want everything readable to count).
- A marked item shows its bookmark on inventory rows and cards, so a player knows it is worth reading. Setting:
  *Show the clue mark to players* (on). Off, the mark is the GM's alone and gathering is silent.

### Gather on read

- The first time a user opens the Reader on a marked item, the module **gathers** it: a clue page is created in the
  Case File (below) if none carries that id, and the reader is appended. The reader is the user's assigned
  character; a user with several characters picks (the same picker Party Stash uses for Take). A GM reading gathers
  nothing unless they choose a character in the Reader's footer (*Read as ...*).
- The gather stamps **found-in**: the scene the reader's token stands on (else the viewed scene), the calendar date
  (`game.time`, through the system's calendar when there is one), the real date, and the holder at that moment.
- The gather **snapshots** the item: name, image, the description's HTML and the item's uuid. The snapshot is what the
  card shows forever, so the card survives the item being given away, sold, destroyed or deleted. While the item is
  still held by the party, a change to its description (the DM fixing a typo, adding what a History check revealed)
  re-snapshots the page and notes the revision.
- A **hook**, `clueboard.gathered`, fires with the clue page and the reader; `clueboard.changed` fires on any later
  change (a new reader, a holder move, a revision). Nothing listens yet. The emitter's rule holds: documented in the
  README and `contracts/case.json`, tolerated if it never fires.

### The holder, through the stash

- The page records the holder as the actor whose inventory carries an item with this clue id. The module resolves
  it live: on `createItem` and `deleteItem` for any item carrying a clue flag it finds the carrier among the party's
  actors (every Group actor's members and the groups themselves) and writes the page. A Party Stash move is a
  create on the destination then a delete on the source, so the holder flips once, to the destination, with no
  flicker; a Give's marked stash row (`flags.fvtt-mod-partystash.giveTo`) is skipped until it lands.
- An item that leaves the party (handed to an NPC's sheet, deleted, sold through Loot Shelf) makes the holder
  **left the party**, with the last holder and the moment kept. The card stays; a DM note field says where it went
  ("given to Sadric").
- A clue in the stash is **readable by every member**, since every member owns the group. That is the Call of
  Cthulhu table: a handout anyone can pick up and read, and a record of who did.
- Party Stash's receipts are unchanged. Party Stash does not need to know Clue Board exists.

### The Case File

- **One JournalEntry per party**, created by the module on the first gather: named *Case File: <group name>*
  (a world with no Group actor gets *Case File*), in a *Clue Board* folder. Its ownership default is **Owner for
  every player**, set at creation, so a reader's own client writes the page it gathered and the players can reread
  and reorder it with no GM online. (Sargas's model, Foundry-native: permissions, search, export and the Session
  Scribe all understand a journal.)
- **A clue is a JournalEntryPage of the module's own sub-type**, `fvtt-mod-clueboard.clue`, with a schema:
  `id`, `kind`, `source` (uuid, type), `snapshot` (name, img, html, revision), `foundIn` (scene id and name,
  calendarDate, realDate), `readers` (character id, name, user id, at), `holder` (actor id and name, or `left`
  with `lastHolder`, `at`, `note`), `tags` (free text), and `pieces` (GM only, below). Foundry's journal sheet
  shows the page's text (the snapshot) to anyone; the module's own **Case File sheet** replaces the entry's sheet
  with a list: a card per clue (image, name, kind, holder, readers, found-in), filters by kind, holder, reader,
  scene and tag, a search box, and *Open the item* when it still exists.
- Players can **tag** a clue and write a **note** on it (a `notes` field, per clue, players' words). That is all
  the authoring Phase 1 gives them; threads, leads and strings are Phase 2.

### Testimony and observation

- Not every clue is an item. The GM gathers by hand: **testimony** from an actor (right-click an NPC: *Gather
  testimony*: a dialog for the words, the readers ticked from the party, the stamp taken as above) and
  **observation** from an item or a place (right-click a marked heirloom: *Gather observation*: "the chalk glows
  constantly here"; or from the scene controls). Each is a clue page like the others, kind set, source linked.
- A chat message can be gathered too (its context menu: *Gather as testimony*), for the NPC line the DM typed.

### The DM overlay: pieces and the nudge

- The GM's layer is a second JournalEntry, *Case File: <group> (DM)*, default ownership None. Its pages are
  `fvtt-mod-clueboard.piece`: `name`, `text`, `expect` (how many clues should carry it before the party has enough)
  and nothing else; a clue page's `pieces` field (GM only, written through the overlay) names the pieces it serves.
- The overlay sheet lists the pieces, each with its gathered clues against its `expect`, and the plot's own rule
  made visible: **two of three gathered and nothing put together, say it through an NPC.** A piece crosses that line
  and the overlay shows the nudge, with a *Said* tick the GM sets when an NPC has. The players never see pieces.
- The Halruaa clue map seeds it: five pieces, `expect` 3, and the eleven heirlooms as marked items with their hidden
  job in a GM-only `hint` on the clue flag. The MCP's `manage-journals` can write the pieces today; a `manage-clues`
  tool is the tidy version (below).

### The export

- **Documents Found** falls out: the Case File sheet's *Export* writes Markdown (one entry per clue gathered since a
  chosen date: the title line, the found-in line, the snapshot as a blockquote, the readers) to the clipboard and to
  a chat whisper to the GM. The Session Scribe reads the same pages straight from the world through the bridge and
  builds the appendix (`STYLE.md`'s *Documents Found*), the Session Diary's readaloud blocks and a *Case so far*
  page: a contract, `contracts/case.json`, versioned by this module, consumed by `fvtt-mcp-sessionscribe`.

### Settings

| Setting | Default | What it does |
| --- | --- | --- |
| Enabled | on | Off leaves the sheets, cards and journals as Foundry and the system have them. |
| Read button on rows | on | The Read column on character and group sheets. |
| Read button on cards | on | Read on item chat cards. |
| Show the clue mark to players | on | The bookmark on marked items' rows and cards. |
| Every described item is a clue | off | Any item with a description and no activities gathers on read. |
| Case per | party | One Case File per Group actor, or one for the world. |

### What it never does

- Writes nothing to chat on a Read. Posts no receipt of its own; a gather is not a transfer.
- Changes no item: the flag is the whole write, and the mark is the GM's. It never moves, copies or deletes an
  item; Party Stash and the system do that.
- Shows players nothing of the DM overlay, not even that it exists; pieces, hints and the nudge live in a journal
  they have no permission on, and the clue page's `pieces` field is stripped from what the sheet renders for a
  player (and is never in the export).
- Never patches a class. Columns are injected through `_configureInventorySections` as Party Stash does; the item
  sheet header button and the context menu entries ride Foundry's hooks.

## Phase 2: the board

- **The board** is a sheet on the Case File: the clues as cards on a cork ground, free placement, **strings**
  between cards, **leads** (sticky notes the players write, with an author), **threads** (a colour and a name a
  player gives to a set of cards, free to be wrong), and the **timeline**: every card with a date the players set
  on it ("the ledger's last line: 29 Tarsakh 1385") drops onto a strip, since this case is a chronology. Players
  own it; the GM sees it too and can add nothing players can tell from their own.
- **The Sargas trial first.** Before building a board, install Sargas Investigation Board on the sandbox, drag
  session 02's nine documents onto a case, and let the table use it for a session or two. If it earns its place, keep
  it and let Clue Board **feed** it: a gathered clue pins itself to the Sargas case as the linked Item card (its
  data model is a journal with sub-type pages, the same shape as ours). Build our own board only if the table wants
  the timeline, the read-stamps on the cards or the holder badge badly enough. Its license is MIT; a fork into the
  family would keep its attribution and its author's name in the README.
- **Reveal on a roll**: a History DC 15 that lands attaches the Keeper's revealed line to the card for all readers.
  The GM presses *Reveal* on the clue in the overlay and picks the hint; the card shows the revision.
- **The MCP's `manage-clues`**: list, mark, seed pieces from a plan's clue map, export the case. Phase 2 because the
  journal tools cover the seeding today.

## How it fits the family

- **Installs and works alone.** Party Stash, Loot Shelf, By the Books and the Session Scribe are detected or absent.
  With Party Stash: the Read column sits in Party Stash's cell on the character sheet (Party Stash's column template
  takes an extra boolean, `read`, the way it took `give`, one small change there) and beside Take on the group sheet;
  without it, Clue Board injects its own column. With By the Books: Read on its item cards reads the item the card
  names (`flags.fvtt-mod-bythebooks` item uuid); the card's own click keeps posting until By the Books adopts the
  Reader for its "read" (its fix list, session 02 §16).
- **One client acts** is not needed: every write is the reader's own, on a journal the players own, so a GM absent
  loses nothing (Party Stash's lesson, 2026-09-30). The kit's `elect.js` is carried for the holder sweep only if a
  sweep is ever needed; Phase 1 writes on the hook that saw the change, from the client that caused it (the mover
  owns both the item and the Case File).
- **Hooks**: `clueboard.gathered`, `clueboard.changed`, documented in the README and the contract. **Contract**:
  `contracts/case.json`, version 1, consumed by `fvtt-mcp-sessionscribe` (its `contracts/consumes.json`).
- **The MCP** gets a `manage-clues` tool in Phase 2 and nothing in Phase 1; `get-world-info` names Clue Board among
  the house modules when it is released.
- **Tooling**: the template's (Biome, Vitest, `verify.yml`, `release.yml`, the kit, `lang/en.json`). Pure modules
  under `scripts/decide/` for everything that needs no Foundry: the holder resolution, the snapshot diff, the
  export's Markdown, the nudge rule; Foundry-facing code under `scripts/`.

## The data

```
Item.flags["fvtt-mod-clueboard"].clue = { id, kind, hint? }      // the mark; hint is GM-only text (phase 2's Reveal)

JournalEntry "Case File: <group>"  (folder "Clue Board", default ownership OWNER)
  page type "fvtt-mod-clueboard.clue"
    system: {
      id, kind: "document" | "testimony" | "observation",
      source: { uuid, type: "Item" | "Actor" | "Scene" | "ChatMessage" },
      snapshot: { name, img, html, revision, at },
      foundIn: { sceneId, sceneName, calendarDate, realDate },
      readers: [{ actorId, actorName, userId, at }],
      holder: { actorId, actorName } | { left: true, lastHolder, at, note },
      tags: [], notes: "",
      pieces: []                     // GM only; stripped for players
    }

JournalEntry "Case File: <group> (DM)"  (default ownership NONE)
  page type "fvtt-mod-clueboard.piece"
    system: { name, text, expect, said: false }
```

## Halruaa, worked

Session 02's documents, as Phase 1 would have recorded them. Every one is an Item in the `Session 02` folders
today; marking the three folders makes them clues.

| Clue | Kind | Readers (as played) | Holder today | Thread the players might name |
| --- | --- | --- | --- | --- |
| Ysolde's Key | document | Lysandra, then all | the stash | the scouts' road |
| Brann's Tally | document | all (eleven clicks) | the stash | the scouts |
| Durgan's Unfinished Letter | document | Kartor, aloud | the stash; to Sadric in session 03 (*left the party*) | Durgan |
| The Wayhouse Ledger | document | Cecil | the house | Durgan; the dates |
| The Lodging Board | document | all | the house (a wall) | Durgan; the lady in grey |
| The Lady's Parcel | document | Cecil | the stash | the lady in grey |
| The Lost-Familiar Notice | document | Tychon | the house | Mirri |
| Spell Scroll: Silence; See Invisibility | document | Tychon | Tychon | the lady in grey |
| The Luck Shoe | observation (the mark) | all, no roll | the house | the mark over the Door |
| The Wayhouse Strongbox | observation (the bright square) | Cecil | the house | the lady in grey |

The DM overlay would carry the five pieces from `plot/plot.md` §4 and the eleven heirlooms; none of session 02's
clues serves a piece yet (Act 1 is growing awareness), but the lady in grey is the heirloom set's first thread, three
clues gathered, and the overlay would be showing the nudge for it now.

## Decisions

Taken here, open for the user to overturn:

- **D1. Who writes.** The reader's own client, on a Case File the players own (default ownership Owner), never the
  elect. A GM absent loses nothing; a player can vandalise the case, which a table that trusts its players accepts
  and the GM can revert through Foundry's journal history (none) or a daily export. *Open:* a *Players may edit*
  setting that drops the default to Observer and routes writes through the elect for a table that wants it.
- **D2. The clue's identity is a flag on the item**, random id, written at the mark, carried by every copy. A uuid
  would break at the first stash move.
- **D3. Read is for everything, gathering is for marked items.** A read-without-posting is useful on its own and
  the GM's mark keeps the case from filling with rations.
- **D4. One Case File per party** (Group actor), a world case when there is none. *Open:* a table with two groups.
- **D5. Snapshot at gather, re-snapshot while held.** The card shows what the party read, and what the DM later
  revealed on the same item, with the revision visible; a lost item freezes.
- **D6. The name**, Clue Board, free on foundryvtt.com's package pages on this pass; the setup-screen check is owed
  before the first release.
- **D7. Phase 2 starts with the Sargas trial**, not with a board of our own.

## Open questions for the user

1. Should a GM reading an item ever gather it (the *Read as* footer), or is a GM read always silent?
2. Does the player see the bookmark (a marked item advertises itself) or does the table prefer discovery?
3. Phase 1 without Party Stash's column template taking a `read` boolean means two cells side by side on the
   busiest sheet. Is a small Party Stash change (1.8.x) acceptable, or does Clue Board inject alone?
4. The export: clipboard and whisper only, or a file in the world's data folder too?
