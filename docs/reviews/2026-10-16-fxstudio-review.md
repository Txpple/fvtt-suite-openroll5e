# Open Roll 5e: FX Studio, the state review of 2026-10-16

Where FX Studio stands after the gap analysis (2026-10-02) and the additional pass that followed it (the
Arcana Unleashed book, the summon and unsummon moments, Magical Cunning and Fiendish Vigor), and a full pass
over the window, which the user describes as unusable in parts and non-intuitive. The module is
`fvtt-mod-fxstudio`; every file path below is relative to its clone unless it says otherwise. Nothing here is
owed; the plan at the end is a proposal for the user to rule on, screen by screen.

Method: the module's binding documents (CLAUDE.md, DESIGN §8 to §13 and §21 to §26, BACKLOG, NEXT-SESSION,
ARCHITECTURE §7, PLAN §6 to §7, ASSESSMENT-6.0 §6 to §7, the shelved redesign); two independent code audits
of the GUI on one brief (Opus at high effort, Fable at high effort), then an adversarial round in which each
marked the other's findings confirmed, wrong or unverifiable; one audit of the gap tooling and the corpus,
with the read-only tools run (`gaps.mjs` and `census.mjs` without `--write`, `gap-check.mjs`, `check-fx.mjs`);
and a live walk of the window on the sandbox through the project's own client, as "Assistant Tester", 44
captures across three scripted passes that opened every dialog and closed it unanswered (House 9 and Misty
Step still Stock before and after each pass). The captures are in the session scratchpad, not in a repo; a
contact sheet of the eight that carry the findings was handed to the user.

## 1. Verdict

The engine, the corpus and the rulings held; the window did not keep up with them. Three things are true at
once:

1. **The content work is sound and mostly unbuilt.** The gap analysis is intact and clean under the moment
   rule (DESIGN §25): 3,166 gaps against the records, 1,599 proposals written and ready, and one built since
   the pass. The pipeline from a proposal to a Stock FX is by hand, and the proposal files have gone stale
   at the edges since the world moved to Echoes (88 rows for keys that no longer exist, one gap with no
   row, every `dist/` output and the workbook still counting 3,253).
2. **The window has real defects, not only taste.** Confirmed on the live sandbox: the greyed-with-a-reason
   design cannot show its reasons at all (a CSS rule kills the hover), the toasts that carry the only
   instruction in the variant flow are wiped before they can be read, a click right after picking a shape in
   "Add a scene" is lost, the sentence box cuts the FX's one sentence mid-word, the inspector's cells overlap
   each other below about 780px, the shape cards in "Add a scene" overflow their borders, an aura's sentence
   reads "1 square around undefined", the two summon FX show an empty Moment cell, and the item-sheet wand
   lands a GM on "No match." with no next step for the one case it exists for.
3. **The causes are structural and cheap to name.** One whole-window `innerHTML` render answers almost every
   change, so focus, caret and scroll are lost and five hand-written workarounds exist beside it; the layout
   is fixed pixel columns with a viewport media query that never fires inside a Foundry window; two of the
   engine's nine moment words are editable; and the live suite stubs every dialog and proves only the ruled
   1080px width, so none of the above has ever failed a check.

The plan (section 8) is in that order: a short fix pass that needs no ruling, then a clickable prototype of
five screens for the user to rule off (the house method, CLAUDE.md "How the user works"), then the Editor,
the entrance, Coverage as the gap tool's screen, and the content in table-value order.

## 2. The numbers

**The corpus** (`recipes/`): Stock 1,030 FX (spells 380, features 285, natural 163, weapons 98, effects 77,
items 25, events 2), every FX answering exactly one key; House 9 (four override a Stock key: greatsword,
maul, rend, noxious-miasma; one has its own Monster Manual record, verdant-wisp; four answer keys no item in
this world carries, made for Greenrest: vesper-staff, necrotic-scythe, first-light-thomas-a-invictus on
`weapon:midnight`, goldthorn-jetten-elisedil on `weapon:goldthorn`). CLAUDE.md names five such House FX;
`irresistible-dance` is Stock (`spell:irresistible-dance`, the SRD 5.2 twin of Otto's), so the list is four.
Ten starters. By moment word: 951 `use`, 77 `effect`, 1 `summon`, 1 `unsummon`, none for By the Books' five
words.

**The records** (`recipes/records.json`, built 2026-10-12 from the Echoes world): 4,194 keys (feature 1,428,
effect 1,156, item 743, spell 460, natural 236, weapon 171) from the 23 packs in `LIST_PACKS`. The books with
the most unanswered records: DMG Equipment 821, PHB Classes 554, MM Features 413, PHB Spells 244 (mostly
spell effects), Faerûn Options 171, PHB Equipment 158, Ravenloft Options 125, PHB Feats 113.

**The gaps** (`node tools/gaps.mjs`, today): 3,166 (feature 1,143, effect 1,079, item 718, spell 81, weapon
73, natural 72).

**The proposals** (`tools/gap-proposals/*.tsv`, 23 files, all dated 2026-10-02): 3,253 rows, no duplicate
keys; 1,613 proposed (Close 1,595, Family 18), 1,640 *No proposed FX*. Since the pass: 1 built (Fiendish
Vigor), so 1,599 proposed and open, 1,566 *No proposed FX* and open. The log's two claims hold against git:
exactly 273 rows went from proposed to *No proposed FX* on the moment-rule cut, and Arcana Unleashed's 13
came in (six spells, four weapons, three natural attacks). Open proposals by kind: effects 618, features
443, items 322, spells 81, natural 71, weapons 64; 186 are Sure on both the picture and the sound.

**The Echoes party** (`node tools/census.mjs`): 82 abilities, 46 play something. Of the 36 that play nothing,
25 (19 keys) have a proposal and 11 were judged moment-less. All 46 world actors: 141 abilities, 98 play, 43
do not (28 with a proposal, 14 moment-less, 1 with no row at all: `natural:makeshift-axe`, the Grimlock's).

**The window**: 2,620 lines under `scripts/ui/` (sheet.js 1,216) and 400 of CSS; four tabs at 1,080×800;
`smoke-screens` 178 checks, every dialog stubbed, one width.

## 3. The window: what was found

Ranked by damage. "Live" means seen on the sandbox and in the captures; "code" means both audits read it and
the adversarial round confirmed it; the file and line are where it lives.

### 3.1 Confirmed live

1. **Greyed-with-a-reason never shows its reason.** `[data-na="true"] { pointer-events: none }`
   (`styles/fxstudio.css:317`) sits on the same element as the `data-tooltip` that holds the reason
   (`scripts/ui/sheet.js:606`, `fxtab.js:99`, `coverage.js:154-155`). Foundry's tooltip fires on
   `pointerenter`, which an element with no pointer events never gets. Hovering the greyed Export button on
   the Library showed no tooltip. Every reason the R1 design relies on (why a cell is off, why Check is
   greyed, why Own key is greyed, "Mark an FX to export it") is unreachable. The suite checks the attribute
   string, never a hover (`tools/smoke-screens.mjs:223, 560, 749`).
2. **The toast is wiped by the render that follows it.** `toast()` paints the `.toast` node
   (`studio.js:239-246`); every render emits a fresh one at `data-on="false"` (`studio.js:204, 208`).
   Duplicate's "Copy of X. Choose the ability it answers, then Save." (`sheet.js:966`), Cancel's "Changes
   dropped." (`:963`), Delete from the Editor and the picker's Use all toast and then render; Save, Import
   and a Library-row Delete render first and keep theirs. Live: 450 ms after Duplicate the toast was off and
   empty. That line is the one instruction the variant flow gives, so Duplicate says nothing.
3. **A click right after picking a shape is lost.** "Add a scene" is a modal DialogV2 that closes from its
   own click handler (`sheet.js:500-517`); Foundry's close awaits a 250 ms transition (a full second when
   the transition never ends, as under reduced motion) before the `<dialog>` is removed, and the page is
   inert until then. Live: a band-tab click 150 ms after picking Swing did nothing; the same click 1.2 s
   later worked, and every click after that worked. So the docked window loses one click, not every later
   click, after each of its six dialogs.
   The other candidate cause, a popped-out window (dialogs are never given a parent, `studio.js:211-223`
   detaches the window, and a modal in the main document would make it inert while the GM looks at the
   pop-out), was not tested live and remains the explanation for "swallows later clicks" if the user sees it
   popped out.
4. **The one sentence per FX is cut mid-word.** `.sentence-box { height: 2 lines; overflow: hidden }`
   (`css:210`); Misty Step's reads "…an unoccupied space they can see · with" and stops. The full text is
   only in a native `title` (`sheet.js:281-282`), the double tooltip the §8 ruling removed elsewhere.
5. **The inspector breaks below about 780px, and the laptop case scrolls the tabs away.** At a 760px window
   the Picture band's cells draw over each other ("COLO… OPAC…", "Under" over "Random"); the tracks are
   `minmax(0, 1fr)` but their contents are `nowrap` (`css:302, 305-307`), beside fixed columns of 288px
   (the rail, `:243`), 168px (the tile, `:282`), 190px (the facets), 250px (the shelf), and the one media
   query tests the browser viewport, not the window (`:149`). At 1,366×768 the window clamps to the screen
   and the whole content pane scrolls (`.fxstudio-content { overflow: auto }`, `:18`; measured 769px of
   content in 702px), so the tab strip and the action bar scroll out of view while editing. The Elevation
   cell is clipped even at 1,080px (Placement band: "99" with the rest hidden).
6. **"Add a scene" overflows its own cards.** The eight shape buttons (`css:266-270`) are a two-column grid
   whose help lines spill outside the button borders at Foundry's dialog width (capture 36). It still
   works; it looks broken.
7. **An aura's sentence says "undefined".** Bane reads "an aura (…) around the caster, 1 square around
   undefined, at 75% opacity". `scripts/core/fx.js:299` appends `persistWords[s.persist]` whenever `persist`
   is not `'none'`; an aura scene with no `persist` (three in Stock; `DEFAULTS.aura` sets none, `fx.js:83`)
   yields `undefined`. The same text is the inspector's caption.
8. **The two summon FX show an empty Moment cell and a false key line.** `ON_WORDS` offers `use` and `effect`
   only (`scripts/ui/html.js:41`) of the nine words in `WHEN` (`core/moments.js:46`); locked mode hides
   unpressed pills (`css:322`), so `summon-appears` opens with nothing under MOMENT (capture 52); unlocking
   and clicking a pill silently rewrites `on` to `use` with no way back. The key line says "event:summon ·
   this world's own item" (`sheet.js:341-343`), which is false, and the title is "Summon (event)". DESIGN
   §26 accepted hand-editing; the display is still wrong.
9. **The item-sheet wand dead-ends on the case it exists for.** `open({item})` lands on the Library with the
   item's name in a search that matches FX names only (`studio.js:71, 166-171`; `fxtab.js:64, 79`). Cassia
   Vell's Multiattack lands on "No match." (capture 53) with no door to make one; the route to the sheet,
   `open({tab:'editor', item})`, exists (`studio.js:66-67`) and no door uses it. The ruling that kept Create
   off the Library said "we'll add new later" (DESIGN §13).
10. **Two identical rows, one Delete.** Searching "misty" lists "Misty Step" twice (the spell and the
    feature) with nothing to tell them apart (capture 02); the Delete confirm says "Delete Misty Step? Stock
    file. Deletes it permanently." without saying which (capture 21). Delete is red and live on every one of
    1,030 Stock rows, between Record and Editor (`fxtab.js:160`).
11. **Coverage lists what the moment rule says can never have an FX.** Cecil's Lute, Lantern, Oil, Tinderbox
    and Flute are "No FX" rows with a "Write an FX for…" door (capture 13). The tab applies only half of
    §25 (it skips a record with no activity unless it is a weapon, `coverage.js:179`, and counts every
    record with an activity), lists no effects (`:50-61`), no natural attacks (Item packs only, `:34`),
    includes the SRD 5.1 packs the records exclude, and knows nothing of the 1,566 rows already judged
    *No proposed FX* nor of the 1,599 proposals. On the party that is 36 "No FX" of which 11 are judged
    moment-less. Its Maintain band says "pull the files into the repo to release" (`corpus.js:20`) over a
    GM's report.
12. **Four spellings of one name.** The Library says "Misty Step"; the Editor's title "Misty Step (spell)";
    the sentence "Misty Step (Spell)"; the ability dropdown "Delayed Blast Fireball (spell)" beside a bare
    "Fire Bolt", every hit tagged "Stock" (capture 33). The empty Editor says "pick one on the FX tab and
    press Edit" when the tab is Library and the door is Editor (`sheet.js:204`); the settings hint promises
    "Look up what plays for any ability", which no screen does (`index.js:19`). The pills and Coverage rows
    print `keyLabel` ("Melfs Acid Arrow (spell)"), a label by the §8 ruling, beside the record's name on the
    title and the Library row (§15, §19): both are ruled, and together they are four spellings.
13. **Move and Sound scenes cannot be played, and nothing plays a whole FX.** ▶ lives in the picture tile
    and is disabled when the scene has no picture (`sheet.js:666, 674`); a Move opens on a Picture band of
    eight greyed cells with "No VFX" (capture 38). `api.preview` takes a whole FX (`api.js:126-136`) and no
    screen calls it with one (Play all was struck, NEXT-SESSION 2026-09-12).
14. **Read mode looks like edit mode.** Locked, the selects and inputs draw exactly as unlocked minus the
    Change button (captures 06, 07); a GM will try to type into them.

### 3.2 Confirmed in code by both audits

- **A half-finished asset pick survives leaving the Assets tab by the tab strip** (`library.js:279-280`
  clears it only on Use or Back); Use then writes into whatever sheet is open, at the remembered scene
  index, with no check that it is the same FX, unlocked, or that the scene exists (`:259-264`); a locked
  sheet is mutated silently and turning Edit on bakes the change into the baseline (`sheet.js:1054`).
- **Browse then Use drops data.** `applyPick` writes `asset = { path }` (`library.js:263`; `sheet.js:1007`
  for sounds). A `{paths}` random set (33 Stock scenes) collapses to one picture and a `{byPosition}` triple
  (3) to one path, with no warning; the validator stays happy and the picture changes. The `template`
  stretch metadata on 198 scenes goes too, which is arguably right when the file changes (the triple
  belongs to the old file) and wrong when a GM re-picks the same family. No scene carries an asset
  `colour`, so nothing is lost there.
- **Every change re-renders the whole window.** `_replaceHTML` is `innerHTML` (`studio.js:208`); every
  `onSheetChange` branch ends in `render()` (`sheet.js:1065-1133`), so a `change` on blur drops focus to the
  body and the inspector cannot be tabbed through; `hydrateSheet` schedules a full render 150 ms after each
  new video's metadata loads (`sheet.js:910`) to feed an overlap strip that no longer exists
  (`renderSequence`, `:569-575`, draws rail and inspector only); `fxstudio.rebuilt` re-renders mid-edit
  whenever any client saves (`studio.js:428`). Library facets and Coverage's book picks and Load more lose
  the scroll (`fxtab.js:201-203`; `coverage.js:196, 199`), against the care taken in `narrow()`.
- **The Editor goes stale after an outside write.** Delete or Import from the Library never touch the open
  sheet (`studio.js:270-311`); `sh-key-hit` reads `app.entries[i]` by a render-time index that `refresh()`
  replaces (`sheet.js:977`); `Studio.open({tab:'editor', …})` replaces a dirty sheet without asking
  (`studio.js:66-69`).
- **The variant signpost.** A renamed copy of Misty Step keeps dnd5e's `misty-step` identifier; choosing it
  as the ability keys `spell:misty-step`, `holderOf` adopts Misty Step's id and Save offers a House override
  of every Misty Step (`sheet.js:147-151, 172-179`). That is the model working (§23); the banner at
  `sheet.js:231` does say the key already has a Stock FX and that Save will ask, and the key's tooltip names
  Own key. But the Answers pill reads "Misty Step (spell)" rather than the item's name, the pointer to Own
  key is a hover that cannot show (3.1.1), and Own key is two columns away with no door from the banner.
  Own key also greys for a world sidebar item because `owner` is `item.actor?.name` (`studio.js:134`,
  `sheet.js:350`), with a reason that is wrong for it ("Open the sheet from an item" when the GM did).
- **What the sheet cannot write that the engine reads**: `from` on a shoot or beam (the place cell writes
  `to` only, `sheet.js:690-691`); `thrown`, `return`, `breathe`, `pulse` (read and clear only, `:654-661`,
  BACKLOG); the size kind (tokens, squares around, fit: edits the number, cannot switch, `:693-703`); `fade`
  on a move (On/Off writes fixed values, `:1131`); `tint` contrast and saturation; the FX note (the box was
  struck; `draftFx` still carries it, `:158`); `custom.calls`; `on` beyond two words; `event:` keys
  (`AUTHORED_KINDS`, `core/subjects.js:29`). A starter cannot be used as a whole FX: Copy from filters
  starters out (`:1037, 1162`) and Add stamps one scene of the shape (`:533`), so the teleport starter's two
  marks never come with its move. Copy from exists only while the sequence is empty (`:572`); Colour is per
  scene and only when the family registers more than one colour (`:682`).
- **What the API offers that no screen shows**: `api.ledger` (what played and why, `api.js:190`),
  `api.sentenceFor().why` (computed in `studio.js:178-187`, rendered nowhere since the pane went),
  `api.preview` on a whole FX, `api.assets.search` over full paths (the Assets search matches family names
  only, `library.js:161`), `api.census().effects`. So "why did it play nothing" has no door: Coverage lists
  only abilities that resolve to nothing, and an FX that exists but did not fire (no targets, no template,
  Off, held by a gate, a miss) counts as "With FX". That was Web's failure.
- **Smaller**: Import replaces a House FX of the same id or creates a Stock override without warning
  (`studio.js:286-290`); `checkBooks` has no catch (`coverage.js:168-190`); after "Edit Stock", Save reopens
  on the House winner, not the Stock layer just written (`sheet.js:1210`); validator problems name raw fields
  ("onMiss must be one of fly-past, play, skip", `fx.js:150` at `sheet.js:233-237`); the Errors tooltip
  lists raw ids; the light theme draws the tile caption dark on dark (`css:287`). The Assets tab's raw
  Sequencer path and file are on screen by ruling (DESIGN §8, step 6) and are not counted here.

### 3.3 Why it is hard to fix (structural)

- State in four bags (`view`, `sheet`, `fxv`, `cvv`, plus `view.library` and three caches) with nothing
  invalidating across them: the stale picker and the stale sheet are the same fault.
- One whole-window render as the default response, with five partial-update strategies beside it
  (`narrow`, the `fx-sel` repaint, `paintExport`, the Assets `rerender` with its own focus restore, the
  `hydrateSheet` timer), each with its own scroll and focus handling. Every new interaction needs a sixth.
- Event routing by class-name substring (`className.includes('cw-')`, `studio.js:361, 390, 398`) and act
  prefix, so sheet acts skip the dirty-sheet guard (`:332-336`).
- Dead acts kept "until the user says" (`create-new`, `delete-fx`, `export-fx`, `effect`; `cw-add`;
  `lib-open-unused`), comments that describe a window that no longer exists (five bands, an overlap strip, a
  Note band, ▶ on the rail: `sheet.js:20-35`; a 300px pane: `studio.js:39-40`; "never a modal": `css:259`),
  and about thirty dead CSS rule groups with the same selectors redefined later in the file.
- No keyboard model: tabs without arrow keys or panels, suggest hits as `<div>`s that cannot take focus,
  segmented switches whose checkbox is invisible so focus has no mark; no `aria-live` on the only feedback
  channel; facet rows 24px, row doors as 12.5px text links, counts at about 3.3:1 contrast and greyed text
  at about 2:1.
- The proof does not cover the failures: every dialog is monkey-patched in `smoke-screens`, no narrow
  width, no keyboard, no pop-out, no light theme, no Coverage Load more, no dirty sheet under the
  `rebuilt` hook, and one check ("Add pills carry tooltips") runs over an empty list and always passes
  (`:672`).

### 3.4 The adversarial compare

Two audits on one brief, each then marking the other's findings. The score: of the second audit's 28
findings the first confirmed 23, part-confirmed 4 and refuted 1 ("1,080×800 is taller than the screen":
ApplicationV2 clamps the height; the scroll it describes is real). Of the first audit's findings the second
confirmed all but four details: Use does not drop a `colour` key (no scene carries one); the variant trap
is signposted by the banner and is a weak door rather than a dead end; the wand button's empty
`data-tooltip` is Foundry's own convention (it falls back to the aria label); and the Assets tab's raw paths
are on screen by ruling. The disputes are settled by the live walk and the Foundry source: the toast wipe is
real at four sites (3.1.2); the closing-transition theory of the modal is right for one click after every
dialog, with the pop-out as the remaining candidate for a persistent swallow, and the second audit moved
to that order (3.1.3); the 520px minimum the second counted among the window's widths belongs to the
Add-a-scene dialog and is struck; the Own key mechanism (owner null for a sidebar item) is the second
audit's and is right. Each found things the other missed: the first alone had the toast wipe, the stale
picker (which the second then ranked into its own top ten as silent data corruption), the Use-drops-sets
loss, the starter-as-a-whole gap and the wand hiding the answering row for a renamed copy; the second
alone had the empty Moment cell, the stale hit index, the Own key greying, the vacuous suite check, the
per-commit `<video>` churn and the duplicate CSS generations. Neither found what only the live walk shows:
the "undefined" in the aura sentence, the Add-a-scene overflow, the clipped Elevation cell, the two
identical rows, the "(Spell)" capitalisation, and that the inspector overlaps rather than scrolls at 760px.

## 4. The gaps and the additional pass: where they stand

**The pipeline** is `gaps.mjs --write` (every record no FX answers, with its `moment` data) → `gap-pool`
(the asset pools) → the proposals written by hand into `tools/gap-proposals/*.tsv` (key, confidence, basis,
VFX, SFX, sentence, fits, in-use) → `gap-assemble` → `gap-check` (paths, bases, duplicates, non-gaps) →
`gap-report` → `gap-xlsx.py` (the Desktop workbook). **A proposal becomes a Stock FX by hand**; Fiendish
Vigor shows the path, and it is a starting point rather than a recipe (the proposal said one energy field,
what was built was a buff rune and a pulse).

**Stale since the world moved** (2026-10-12): `gap-check` reports 88 proposals for keys that are not gaps:
Fiendish Vigor plus 87 Greenrest-world keys (`zz-world-and-monsters.tsv` 69 none and 13 proposed,
`zz-stragglers-1.tsv` 5 none); one Echoes gap with no row (`natural:makeshift-axe`); `dist/gaps.json`,
`dist/proposals.tsv`, `dist/gap-report.json` and the workbook all dated 2026-10-02 at 3,253 against today's
3,166; the `dist/pool-*.txt` files from 2026-09-08. Otherwise clean: 0 bad paths, 0 bad bases, 0 missing
assets (`check-fx` PASS over 2,491 assets).

**What the pass produced**: the moment-rule cut (273 rows), 307 new rows (286 Arcana, 21 world), the fit and
in-use columns, 13 Arcana Stock FX, `events.json` with 2 FX, Fiendish Vigor built and Magical Cunning
re-made. **What is open**: 1,599 proposals, grouped above; 1,277 of them use an animation no FX plays yet;
the commonest bases to copy from are conjure-animals (91), mage-armor (73), ensnared (66), lingering-acid
(57), frightened (56).

**One conflict to rule on**: `spell:shield` is proposed (Close, Sure on both) while the standing behaviour,
pinned by `smoke-boot` and `smoke-replay`, is that the Shield spell plays nothing and the Shield effect
plays the barrier.

**Moments.** `WHEN` has nine words (use, effect, maneuver, sneak, fold, rider, hold-answered, summon,
unsummon); the Editor authors two. No FX anywhere is written for the five By the Books words, so a
maneuver plays only when its item has a `use` FX to fall back on (`FALLS_BACK_TO_USE`; `feature:parry`,
`feature:riposte` and twelve other Battle Master maneuvers are open proposals). By the Books' contract
(`contracts/moment.json` v2) carries 17 words and 62 word-and-kind moments; the reader acts on five plus
`cast|summon` and logs twelve words as skips. Already emitted and unread, needing nothing from By the Books:
`save` (with outcome, auto-fail, auto-success), `damage|receipt` (parts by type, resisted or immune),
`break|concentration`, `mastery`, `shield`, `spend`, `volley`, `metamagic`. Needing a dnd5e-side reader:
ordinary save cards, attack mode (thrown versus strike; the `thrown` knob swaps the picture by distance, not
by dnd5e's mode), death saves, turn and rest cards (ASSESSMENT ruling D unmade), Region enter and leave,
teleport.

**Quality.** The parked QA pass's 26 candidates (a mark at impact or a shoot to each target with no scene at
the template) regenerate from a one-line query; read against their activities, four are true areas
authored as ranged: `spell:ice-knife`, `weapon:grenade-launcher`, `feature:dominate-mind`, `item:bomb`.
The migration report's lost `templatefx` rows give 42 more leads after Web and the Breath Weapons. Things
that silently play nothing today: the four House FX with no record here, the four Stock FX House overrides
(by design), a targetless area cast (the 97-moment allowance), the one Stock `clearTemplate` for a player
caster, every By the Books word on an item with no `use` FX, and `hold-answered`, which never falls back.

## 5. Rulings this touches

A fix that would reopen a ruling says so here; the user re-rules or the fix stays out.

| Finding | The ruling | What a fix needs re-ruled |
|---|---|---|
| 3.1.9, the wand and a Library search miss | DESIGN §13: no door on the Library makes an FX, "we'll add new later" | that later is now, and where Create lives (a search miss, the wand landing, a Coverage row) |
| 3.1.10, 3.1.12 row identity | §11, §13: a row is a name | a kind tag or the key on a row, at least when two rows share a name |
| 3.1.13 | NEXT-SESSION 2026-09-12: no Play all | a whole-FX preview |
| 3.1.8, event keys and the words | §26: the Editor neither authors `event:` nor offers summon | the Moment cell naming all nine words and `event:` as an authored kind |
| 3.2 the picker | §12 "remove the use button"; BACKLOG: the picker contract does not change | picking into a scene without leaving the sheet; widening `applyPick` to keep metadata |
| 3.2 the inspector | §9 step 4 (R1: greyed in place, never dropped; fixed 4×2 bands) | collapsing dead cells, opening on the shape's own band, a size-kind switch, a `from` cell |
| 3.1.5 the layout | R2 "one breakpoint moves whole panels" | a window-width breakpoint (container query) under R2; consistent, needs naming |
| 3.1.11 Maintain | §9 step 7: Maintain is the band at the top | moving the repo note and Import to Stock off a GM's report |
| 3.2 the note | the Note box struck 2026-09-12 | an editable House note (§23 wants "its own words") |
| 3.2 "Edit Stock" | §21: Save on Stock asks override or Stock | a guard or a second confirm on Edit Stock |
| the variant with no item | §23: a key is earned, never typed | Sharran Step when no item carries it yet; today the answer is "make the item first" |
| `spell:shield` | the standing behaviour (effect plays, spell does not) | whether the proposal is built |

## 6. What needs no ruling

These are defects against the rulings as they stand, each a line or a few, and the gate and `smoke-screens`
cover them once the suite drives a real dialog and a second width:

the hover rule (put `pointer-events: none` on the control inside, not the element with the reason, or
give the reason a visible mark); the toast (paint after the render, `aria-live`, sticky to the window not
the content); the lost click (await the dialog's close before resolving the pick); the sentence box (an
ellipsis and a click to expand, or the full text); the Elevation cell; the Add-a-scene cards; the aura
"undefined" (`persistWords` default); the summon FX's Moment cell and key line; the stale resting text and
settings hint; the stale hit index; the Editor left on a deleted or re-imported FX; the Coverage scroll
loss; the `hydrateSheet` render that feeds nothing; the dead acts and dead CSS; the comments; CLAUDE.md's
five-FX list (four); the gap data (`gaps.mjs --write`, the 88 stale rows retired, the makeshift-axe row
written, the workbook regenerated).

## 7. What to rule first

1. Does Create get a door, and where: the wand landing, a search miss, a Coverage row, or all three?
2. Do the nine moment words and `event:` keys become editable in the Editor?
3. Is "pick into the sheet without leaving it" wanted (a drawer or a picker that keeps metadata), or does
   the Assets tab stay the picker with the stale-state and metadata fixes only?
4. The inspector: keep the five bands with the reasons made visible and ▶ on every scene, or collapse to
   the cells a shape reads, opening on its own band?
5. A window-width breakpoint for the sheet (rail over inspector below ~800px) under R2?
6. Coverage: does it become the gap tool's screen (the moment rule in full, the proposals, effects and
   natural attacks, the ledger's "why"), or stay a count?
7. Which content first: the party's 19 keys, the PHB Sure/Sure spells, the maneuvers, the QA four?
8. `spell:shield`: build the proposal or keep the behaviour.

## 8. The plan

Each phase ends green (the ten offline checks, the live suites it touches) and in a release on the user's
word; a patch unless the user names a minor. Nothing starts without "go".

**Phase 0: the fix pass (no ruling, one session).** Everything in section 6, plus `smoke-screens` driving
one real DialogV2 (Add a scene, Delete answered No) and measuring sideways scroll at 1,080 and 780, and a
`check-sentence` style assertion that no generated sentence contains "undefined". The gap data refreshed and
`gap-check` clean. CLAUDE.md's State block corrected.

**Phase 1: the prototype (the ruling instrument, one session).** One clickable HTML artifact, the house
method, built from `prototypes/fxstudio5-editor.html` (the ruled base) rather than `shelved/`, mocking five
screens with the real Misty Step, Rend, Bane and summon-appears as content:

1. the entrance: "nothing plays for Multiattack" from the wand, a search miss and a Coverage row, with
   Starter (whole), Copy from, Blank;
2. the Key strip and Moment with all nine words and an `event:` key, the key's explanation on screen;
3. the inspector two ways: the five bands with visible reasons and ▶ on every scene, against one column of
   the cells the shape reads, with a size-kind switch and a `from` cell, and Play all;
4. the sheet at 780px and at 1,366×768 with the rail stacked over the inspector;
5. Coverage rows that say why ("no FX", "no proposed FX: always on", "has an FX, played nothing: no
   targets") from the moment data, the proposals and the ledger, with effects and natural attacks.

The user rules off it; the rulings go to DESIGN as §27 onward.

**Phase 2: the Editor (two sessions, after the rulings).** The render model first: a render per pane with
focus and scroll kept, no whole-window `innerHTML` on a knob change, the five workarounds retired; then the
layout as container queries under R2; then the inspector and the Key strip as ruled, ▶ for every scene
kind and Play all if ruled, the picker's stale state and metadata loss closed, Own key for sidebar items,
the variant trap caught (a chosen ability whose identifier is another FX's key says so and offers Own key),
`from` and the size kind, and a keyboard model (tabs, suggest lists as listboxes, focus marks). The suite
grows the narrow-width walk, the keyboard walk and the dirty-sheet-under-rebuilt case. A minor.

**Phase 3: the entrance and the Library (one session).** Create where ruled; the wand opening the Editor on
the item when nothing answers; a kind tag or the key on rows that share a name; the Delete confirm naming
the key and the layer; the empty Editor's text; the four spellings made one (the record's name everywhere,
DESIGN §15).

**Phase 4: Coverage as the gap tool's screen (one session).** The moment rule in full (no activity, always
on, bookkeeping, chosen at a rest), the proposals read from the TSVs the module ships or a built
`recipes/proposals.json`, effects and natural attacks, the pack list scoped to `LIST_PACKS`, the SRD 5.1
packs out, the ledger's last plays and their reasons on a row, Maintain moved where ruled. The tab and
`gaps.mjs` agree to the number.

**Phase 5: the content, in table-value order (several short sessions, each a patch).**

1. The Echoes party's 19 keys with proposals (25 of its 36 misses): the three smites, the three detects,
   Shield of Faith, Battle-familiar, the lamp, torch and instruments, Pact of the Blade, Stonecunning,
   the battleaxe. `spell:shield` as ruled.
2. The remaining PHB spell proposals (37; the seven Sure/Sure first: the other four smites, Heal, Mass
   Healing Word, Aura of Vitality).
3. The 14 Battle Master maneuvers, so By the Books' `maneuver` has something to play; then the first FX
   authored for a By the Books word once the Editor offers it.
4. The QA four (Ice Knife, the grenade launcher, Dominate Mind, the bomb) re-authored as template fills,
   and the 42 `templatefx` leads triaged.
5. Conditions and spell effects on players (`effect:prone`, `effect:paralyzed`, the 18 Guidance effects).
6. The Monster Manual (193 features, 47 natural attacks, 87 effects) and Ravenloft's 21 attacks.
7. The DMG and Arcana bulk (223 and 40 items, 55 and 6 weapons, 128 DMG effects).

**Phase 6: moments (after Phase 2, one session each).** Read what By the Books already emits (`save`,
`damage|receipt`, `break|concentration`, `mastery`, `shield`) with a Stock event FX per word where the user
wants one; then the dnd5e-side readers in ASSESSMENT's order (save outcomes, thrown versus strike, damage
type on landing) once ruling D is made.

## 9. The captures

Forty-four PNGs in the session scratchpad, three scripted passes (`shots.mjs`, `shots2.mjs`, `shots3.mjs`)
through `tools/lib/foundry.mjs` as "Assistant Tester"; every dialog closed unanswered; the corpus checked
unchanged before and after each pass. The eight on the contact sheet: the read-mode Editor (the cut
sentence, the clipped cell), the summon FX (the empty Moment cell), the 760px Editor (overlap), Add a scene
(overflow), Bane ("undefined"), Coverage on My actors (the lute and the tinderbox), the wand landing ("No
match."), and the ability dropdown (the spellings).
