# Plan — Clue Board, a new Open Roll 5e module

**PHASE 1 BUILT 2026-10-29** as `fvtt-mod-clueboard` 0.1.0 on `main`, unreleased, deployed to the sandbox (mirrored from
prod the same night) and walked there by its `tools/live-check.mjs` (a GM page and a temporary player page; GREEN: the
Clue type, the Read column, the gather with its stamp, the tab after Journal, the holder following a move). The sandbox's
Session 02 documents are Clues, three of them gathered (Kartor read the letter and the key, Cecil the letter and the
ledger). The decisions below stand as written; what the build changed: the stamp skips the stock calendar's date (a world
with no calendar would stamp "0000-01-01"), and the Clue page type is registered whether or not the module is enabled.
**Revised the next morning on the user's word** ("no sidebar panel, totally broke the ui"): the sidebar tab stuck the
sidebar, so Mysteries is a window of its own opened centred from a scroll button on the strip after Journal, never a
sidebar panel (D8 below, revised).

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

## Phase 1: the Clue type, Read, Mysteries

Three things, nothing else. No DM window, no export, no testimony, no board.

### The Clue type

- **A clue is a loot item whose type is Clue.** dnd5e's loot items carry a subtype in `system.type.value` (gear,
  treasure, junk, material, resource, art, gem) from `CONFIG.DND5E.lootTypes`; at `init` the module adds
  `clue: { label: "Clue" }`, and the item sheet's own type dropdown offers it. Nothing else marks a clue: no flag,
  no tag button, no folder menu. The GM sets the type when building the item (the MCP's `manage-items` sets it in
  bulk; the Halruaa `Session 02` folders are nine edits), and the test everywhere is one line, a loot item of type
  `clue`. Changing the type back makes it an ordinary item and leaves any Mysteries entry as it is.
- **The clue's identity** is written at the first gather: `flags.fvtt-mod-clueboard.id`, a random id, by the reading
  client (it owns the item's actor: the stash is every member's, a character its player's). Flags travel with the
  item through every copy the system makes, so a Party Stash move (a copy landed, then the source deleted) keeps it,
  and so does a Give through the stash. A Clue nobody has read yet has no id and needs none.
- A Clue shows a bookmark on inventory rows and item cards for everyone, so a player knows it is worth reading.
  (Setting: *Show the mark to players*, on; off, gathering is silent.)

### Read, in the stash only

- **A Read button on every inventory row of a Group actor's sheet**, the party stash, and nowhere else in phase 1
  (the user, 2026-10-29: "only when something is in party stash, I don't want to mess with player inventories yet";
  character sheets, item cards and the item sheet are phase 2). It opens the **Reader**: the item's image and
  description as a document, nothing else of the sheet (no price, no weight, no Use). **It never posts to chat.**
  This is the fix session 02 asked for (the players clicked two cards eleven times to read them; every click posted).
- Read is for every item in the stash; reading an item that is not a Clue is just reading, nothing is recorded.
- **Gather on read, the one trigger.** The first time a user opens the Reader on a Clue in the stash, the clue is
  gathered: the id is written on the item if it has none, an entry is created in Mysteries if none carries that id,
  and the reader is appended. Nothing else puts anything in Mysteries. The reader is the user's assigned character;
  a user with several picks (the picker Party Stash uses for Take). A GM's read gathers nothing.
- So the table's rhythm is the stash's: loot found goes into the stash (Party Stash's Stash button, a drag, the
  GM's drop), the players read it there, and what they take out they have already read. A Clue taken before anyone
  read it is not in Mysteries until it comes back to the stash.
- The gather stamps **found-in**: the scene the reader's token stands on (else the viewed scene), the calendar date
  (`game.time`, through the system's calendar when there is one), the real date, and the holder at that moment.
- The gather **snapshots** the item: name, image, the description's HTML, the item's uuid. The snapshot is what the
  entry shows forever, so it survives the item being given away, sold, destroyed or deleted. While the party still
  holds the item, a change to its description (the DM adding what a History check revealed) re-snapshots the entry
  and notes the revision.
- On the Group sheet the Read column sits beside Party Stash's Take when Party Stash is active (its order 1100,
  priority 1000, so dnd5e hides the system's columns first); without Party Stash the column stands alone.
  Detection, never `requires`.

### Mysteries

- **A scroll button on the sidebar's strip, directly after Journal, that opens Mysteries as a window in the middle
  of the screen**, like FX Studio's. Built first as a sidebar tab (`Sidebar.TABS` and `CONFIG.ui`), whose panel
  stuck the sidebar on the sandbox; the user ruled it out the next morning. The button is not a tab: the sidebar
  never switches or expands for it, and nothing of the module's is drawn inside the sidebar.
- **The window** lists what the party has gathered: one entry per clue with its image, name, holder, readers and
  found-in; a search box; filters by holder (the stash, a member, left the party) and reader (me, nobody yet); a
  click opens the Reader on the snapshot; *Open the item* when the item still exists and the user can see it.
  Players may write a **note** on an entry and give it **tags** (free words). That is all the authoring phase 1
  gives them.
- Entries the party has not read yet are not in the list; the window shows what is known and a count of what is
  not (*4 of 9 clues gathered*, counting the Clue items on the party's actors), nothing more. (Setting: *Count the
  ungathered*, on.)
- **The holder follows the item.** On `createItem` and `deleteItem` for any Clue carrying an id, the module
  finds the carrier among the party's actors (every Group actor's members and the groups themselves) and writes the
  entry. This only watches the hooks; it writes nothing on a character and adds nothing to a character sheet. A Party Stash move is a create on the destination then a delete on the source, so the holder flips once;
  a Give's marked stash row (`flags.fvtt-mod-partystash.giveTo`) is skipped until it lands. An item that leaves the
  party (handed to an NPC's sheet, deleted, sold through Loot Shelf) makes the holder **left the party**, with the
  last holder and the moment kept; the entry stays. Party Stash's receipts are unchanged and Party Stash never knows
  Clue Board exists.
- **Where it lives.** One JournalEntry per party, *Mysteries: <group name>* (a world with no Group actor gets
  *Mysteries*), in a *Clue Board* folder, created on the first gather with default ownership **Owner for every
  player**, so the reader's own client writes the entry it gathered and the players can reread it with no GM online.
  Each clue is a JournalEntryPage of the module's sub-type `fvtt-mod-clueboard.clue`. The sidebar tab is the only
  door the players need; the journal is there for Foundry's own search, export and the Session Scribe.
- **Hooks**: `clueboard.gathered` (the entry and the reader) and `clueboard.changed` (a new reader, a holder move, a
  revision). Nothing listens yet. The emitter's rule holds: documented in the README and `contracts/case.json`,
  tolerated if it never fires.

### Settings

| Setting | Default | What it does |
| --- | --- | --- |
| Enabled | on | Off leaves the group sheet, the sidebar and the journals as Foundry and the system have them. |
| Show the mark to players | on | The bookmark on Clues' rows in the stash. |
| Count the ungathered | on | Mysteries shows how many Clues nobody has read. |

### What it never does

- Writes nothing to chat on a Read. Posts no receipt of its own; a gather is not a transfer.
- Changes no item beyond the id flag at the first gather: it never moves, copies or deletes an item, and never sets
  a type; Party Stash, the system and the GM do that.
- Touches no character sheet, item card or item sheet (phase 2).
- Never patches a class. The loot type is a `CONFIG.DND5E` entry; the group sheet's column is injected through
  `_configureInventorySections` as Party Stash does; the sidebar tab rides `CONFIG.ui`.

## Phase 2: the board and the DM's side

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
  model is a journal with sub-type pages, the same shape as ours). Build our own board only if the table wants the
  timeline, the read-stamps on the cards or the holder badge badly enough. Its license is MIT; a fork into the family
  would keep its attribution and its author's name in the README.
- **The DM's overlay**: a second journal, *Mysteries: <group> (DM)*, default ownership None, with **pieces** (the
  truths the clues add up to, each with how many clues it should take) and the plot's own rule made visible, **two of
  three gathered and nothing put together, say it through an NPC**, with a *Said* tick. A clue's `pieces` field is
  GM-only and stripped from anything a player's client renders. The Halruaa clue map seeds it: five pieces, `expect`
  3, and the eleven heirlooms as Clues with their hidden job in a GM-only `hint` flag.
- **Testimony and observation**: clues that are not items, gathered by the GM by hand from an actor (*Gather
  testimony*), a Clue heirloom (*Gather observation*: "the chalk glows constantly here") or a chat message.
- **Reveal on a roll**: a History DC 15 that lands attaches the Keeper's revealed line to the entry for all readers.
- **The export**: *Documents Found* as Markdown from Mysteries (the title line, the found-in line, the snapshot as a
  blockquote, the readers), to the clipboard and a GM whisper; the Session Scribe reads the same pages through the
  bridge and builds the appendix (`STYLE.md`'s *Documents Found*), the Session Diary's readaloud blocks and a *Case
  so far* page. A contract, `contracts/case.json`, versioned here, consumed by `fvtt-mcp-sessionscribe`.
- **The MCP's `manage-clues`**: list, set the Clue type in bulk, seed pieces from a plan's clue map, export the case.

## How it fits the family

- **Installs and works alone.** Party Stash, Loot Shelf, By the Books and the Session Scribe are detected or absent.
  With Party Stash: the Read column sits beside Take on the group sheet (in Take's cell if Party Stash's
  `take-column.hbs` takes a `read` boolean, the way its stash column took `give`; else its own column after it);
  without Party Stash, Clue Board's column stands alone. By the Books' item cards keep their own "read" until phase
  2 (its fix list, session 02 §16).
- **One client acts** is not needed: every write is the reader's own, on a journal the players own, so a GM absent
  loses nothing (Party Stash's lesson, 2026-09-30). The kit's `elect.js` is carried unused in phase 1.
- **Hooks**: `clueboard.gathered`, `clueboard.changed`. **Contract**: `contracts/case.json`, version 1, with no
  consumer until phase 2's export.
- **The MCP** gets nothing in phase 1; `get-world-info` names Clue Board among the house modules when it is released.
- **Tooling**: the template's (Biome pinned to the family's 2.5.15, Vitest, `verify.yml`, `release.yml`, the kit,
  `lang/en.json`). Pure modules under `scripts/decide/` for everything that needs no Foundry: the holder resolution,
  the snapshot diff, the sidebar table rebuild; Foundry-facing code under `scripts/`.

## The data

```
CONFIG.DND5E.lootTypes.clue = { label: "Clue" }                  // at init; the signifier is system.type.value
Item.flags["fvtt-mod-clueboard"].id                               // written at the first gather; phase 2 adds hint

JournalEntry "Mysteries: <group>"  (folder "Clue Board", default ownership OWNER)
  page type "fvtt-mod-clueboard.clue"
    system: {
      id,
      source: { uuid },
      snapshot: { name, img, html, revision, at },
      foundIn: { sceneId, sceneName, calendarDate, realDate },
      readers: [{ actorId, actorName, userId, at }],
      holder: { actorId, actorName } | { left: true, lastHolder, at },
      tags: [], notes: ""
    }
```

Phase 2 adds `kind` (document, testimony, observation), `pieces` (GM-only) and the DM journal's `piece` pages.

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

- **D1. Who writes.** The reader's own client, on a journal the players own (default ownership Owner), never the
  elect. A GM absent loses nothing; a player can vandalise the record, which a table that trusts its players accepts.
  *Open:* a *Players may edit* setting that drops the default to Observer and routes writes through the elect.
- **D2. The signifier is the loot type** (C10): a `clue` entry in `CONFIG.DND5E.lootTypes`, set in the item's own
  type field, nothing of the module's on an unread item. **The identity is a flag**, a random id written at the first
  gather and carried by every copy; a uuid would break at the first stash move.
- **D3. Read is for everything, gathering is for Clues.** A read-without-posting is useful on its own and the
  type keeps Mysteries from filling with rations.
- **D4. One Mysteries per party** (Group actor), a world one when there is none. *Open:* a table with two groups.
- **D5. Snapshot at gather, re-snapshot while held.** The entry shows what the party read, and what the DM later
  revealed on the same item, with the revision visible; a lost item freezes.
- **D6. The names.** Clue Board, free on foundryvtt.com's package pages on this pass, the setup-screen check owed
  before the first release; Mysteries for the tab and the window (C9).
- **D7. Phase 1 is three things** (C7, C8): the Clue type, Read in the stash, the Mysteries tab and window.
- **D9. The stash's Read is the only trigger** (the user, 2026-10-29): no Read on character sheets, item cards or
  the item sheet in phase 1; player inventories are untouched. The DM's side, testimony,
  observation, the export, the MCP tool and the board are phase 2; the Sargas trial comes before any board of ours.
- **D8. A window off a button on the sidebar's strip, not a sidebar panel and not a journal sheet** (C8, revised
  2026-10-29 on the user's word after the panel stuck the sidebar). The journal behind it is storage.

## Open questions for the user

1. Does the player see the bookmark (a Clue advertises itself), or does the table prefer discovery?
2. On the group sheet, Read in Take's cell needs Party Stash's `take-column.hbs` to take a `read` boolean (a small
   1.8.x change); without it, Read is its own column after Take. Which?
3. The strip button's icon: a sealed scroll, a magnifying glass, an eye?
