# Open Roll 5e: the suite review of 2026-10-15

A software-engineering review of the whole family after the first passes over the six books (feats,
spells, classes, the Monster Manual, the DMG rows, the three splat books). What held, what bent, where
the approach is not uniform, and the path that keeps this repeatable. The MCP's tool-surface ceiling
(fvtt-mcp-dnd5e issue #18) has [its own analysis](2026-10-15-mcp-tool-surface.md).

Method: the suite's manifests, maps and git history; every sibling's binding documents (By the
Books' DESIGN, ARCHITECTURE, BACKLOG and tools/README; the MCP's CONTRIBUTING, design.md and the
3.0 plan); `npm run verify` and `npm test` run offline today; the last battery's record; three
read-only audits delegated over the hub's code patterns, the eight other modules with the two small
servers, and the MCP's architecture. Nothing live was touched.

## 1. Verdict

The architecture held. The hub's four-layer model, its flags-as-state and card-as-bus rules, its
registry model and its one-writer discipline carried six books of rules in eight weeks without a
structural debt row being opened, and the static gate that pins those rules ran green today in
twenty seconds. What bent is the process around it: in the last three days of releases the proof
(the live battery) fell behind the shipping, and when it caught up it found three real bugs and a
dozen harness-hygiene faults. The second thing that bent is uniformity at the edges: the hub has one
sanctioned way to open a moment popup, pick a creature and write a per-target flag, and beside each
of those a tail of hand-built sites that the static gate does not cover. The family beyond the hub is
uneven: the hub's discipline (tests and a gate that runs them) reaches three of the other eleven
repos. The documents, the suite's own most of all, have become journals that every session must
read. None of this is structural. All of it is the kind of drift that is cheap now and expensive in
three months.

## 2. The numbers

| Repo | Code | Tests | Gate | Releases since 2026-09-15 | Commits since 2026-09-15 |
| --- | ---: | ---: | --- | ---: | ---: |
| fvtt-mod-bythebooks | 51,499 lines in 146 script files; 53,322 in tools/ | 1,519 unit (66 files) + 46 live suites / 2,250 checks | 18 static checks + unit in `npm run verify` (20 s); CI on push; release by CI from a tag | 40 (v2.0.0 → v3.4.7) | 540 |
| fvtt-mcp-dnd5e | 78,563 lines TS, 261 files | 2,033 unit (109 files); 7 integration files / 88 cases; 64 verify scripts | biome, tsc, vitest, build, knip; ci.yml | 4.0.0 → 4.6.0 | 186 |
| fvtt-mod-fxstudio | 166 files; 5,343 shipped lines | 9 check scripts, run only inside the zip build; 5 live smokes | none | 0.9.x → 0.10.2 | 55 |
| fvtt-mod-errata5e | 46 files; 312 shipped lines | the register check; 3 live suites | check.yml, upstream-watch.yml | 1.0 → 1.2.2 | 45 |
| fvtt-mcp-imagegen | 70 files; 2,781 lines TS | 134 unit (+9 Python) | none | 8 tags | 101 |
| fvtt-mcp-sessionscribe | 91 files; 4,978 lines TS | 140 unit | ci.yml | 5 tags | 54 |
| fvtt-mod-lootshelf | 32 files; 2,808 shipped lines | none (3 live checks) | none (the only module with `socket: true`) | 12 tags | 28 |
| fvtt-mod-partystash | 17 files; 1,974 lines in one file | none (2 live checks) | none | 14 tags | 21 |
| fvtt-mod-areasounds | 18 files; 1,174 shipped lines | a 53-check engine test nothing runs | none | 5 tags | 12 |
| fvtt-mod-combatplus | 13 files | none | none | 13 tags | 12 |
| fvtt-mod-autoexplore | 5 files | none | none | 6 tags | 10 |
| fvtt-mod-openserver | 6 files | none | none | 5 tags | 9 |

Other measurements that shape the findings:

- By the Books' release cadence: 12 releases between 2026-10-12 and 2026-10-14; three of them
  (3.4.5, 3.4.6 and the asks-widened work) shipped on hand walks without the battery; the battery
  before 3.4.7 took three full runs and a partial (51 min each) to reach 55/55.
- The battery's hygiene faults found that day were harness faults, not module faults: a foreign
  combat stamping every receipt, the house rule walking fixtures to Exhaustion 6, a downed condition's
  Prone rider surviving into the next suite, gear chests left on the range, and a Sleep template
  waiting 600 s for a canvas click that skipped a teardown and zeroed the Decision Timer for every
  suite after it.
- The harness: 46 smoke suites are 40,138 lines (the largest, `smoke-classes.mjs`, is 7,137); 29
  probes 3,302; 18 checks 3,002; the shared harness files about 1,600.
- Documentation weight: the suite's CLAUDE.md is 5,834 words with 64 dates across 12 days, and its
  longest bullet is 1,044 words of deploy history. By the Books' top-level markdown is 130,984 words
  (RULINGS.md 4,102 lines, NOTES.md 1,575, ARCHITECTURE.md 1,341); FX Studio's 52,480. The State-block
  convention is honoured by Session Scribe and FX Studio; Errata and imagegen carry a CLAUDE.md without
  one; By the Books has no CLAUDE.md (its ARCHITECTURE and DESIGN serve, but the suite file says each
  sibling's CLAUDE.md is authoritative).
- Hot files in By the Books since 2026-09-15: `decide/registry.js` touched by 118 commits,
  `decide/moments.js` 79, `settings.js` 47, `reminders.js` 41, `emanations.js` 37.
- Scope left open by design: WAIT rows in the registers: Arcana 24, Faerûn 16, Ravenloft 14, the
  Monster Manual 12, the DMG 7, the classes 2; the epic boons of every book parked; four PHB feats
  parked for a player; the two reaction kinds and three items scoped out for good.
- Known, accepted edges: 56 whole-chat-log scans in 34 files (parked until a world's age makes them
  felt); ActiveEffects still found by name in the effect table (a renamed pack effect goes silent);
  no `lang/` folder in any of the nine modules (every string is English in code).

## 3. What held: the strengths to keep

**The hub's architecture is written down and mechanically held.** DESIGN names four north stars and
five binding rules; ARCHITECTURE turns them into layers with a dependency rule (`check-layers`, every
exception pinned with a reason and failing when its edge goes), one-writer discipline over every
world write reachable from an every-client hook (`check-writers`), a hook set pinned to the installed
dnd5e's own bundle (`check-hook-dispatch`), one map of every platform HTML anchor (`check-surfaces`),
every flag key classified as a resolve or state (`check-moments`), a coverage map checked both ways,
an HTML-escape check, a rule-fold check and the picker gate. The debt ledger (§10) says nothing is
owed and says why an empty ledger is dangerous (the layers tool still lists one parked edge as
open; §5). Twenty seconds, 1,519 tests, CI on every push, and a release that only CI
publishes from a green annotated tag on main.

**The registry model is why six books fit in eight weeks.** 109 tables and 40 pinned kinds; a rule
is a row that cites its book, a unit test and a suite section, and the audits' registers and drawings
give every row a trail back to the text. The R4 tripwire makes a new kind a noticed event.

**The state model is simple and has survived contact.** All persisted state is a flag on a document;
every view is reconstructable from it after a reload; no sockets, no patching, no workflow object;
every world write carries a receipt with prior values. The no-GM mode and the two-client suite cover
properties most Foundry modules never test.

**The live battery is a real asset.** 46 suites, 2,250 checks, a preflight that refuses a foreign
combat, settings snapshots restored, fixtures built from the compendia and torn down, `--changed` to
select what a change needs, a heartbeat that names the stage a suite is in. The 2026-10-14 run is the
proof: it found three module bugs and five harness faults that hand walks had missed.

**Rulings before code, prototypes before UI.** RULINGS.md records every table decision with its
date; sixteen HTML prototypes under `prototypes/` were ruled off before anything UI-shaped was built.
That is the discipline that keeps the module "offered, never enforced".

**The suite layer is thin and generated.** `repos.json` is the one manifest; the README catalogue and
every sibling's "Part of Open Roll 5e" section are generated from it; the integration map and the
upstream surface are generated from the clones; the daily watch opens one review issue per upstream
release with a lead per repo. Every one of the nine module manifests follows the release convention
(verified today). Nothing is shared through the suite, so every module still installs alone.

**The MCP server's shape is the family's second written architecture.** A registry-derived tool
list, toolsets and a read-only mode, receipts with undo on every write, a host seam that `git grep`
can police, join fixtures per Foundry build, a skills matrix with 0 unresolved names, and context
budgets printed on every test run. The 3.0 consolidation was planned, measured and closed in writing.

## 4. The major issues, ranked

1. **The proof fell behind the shipping.** Three releases in three days went out without the
   battery, and the battery that followed found three real bugs in 3.4.5 (a kill reverted out of
   combat raced dnd5e's removal of the downed condition; the downed condition landing twice; a locked
   Sleep that no longer ended on damage). Each of those reached prod. The cause is structural, not
   carelessness: the battery takes 51 minutes, needs a sole GM seat, and the sandbox is also the
   table's test range, so under time pressure it is the step that gets skipped. The owed-battery
   habit ("the two owed battery runs stay owed") is the tell.
2. **Two GM clients at once is a hole in the single-writer model** (suite issue #8). The elect is
   one user across every client, but every `game.user.isGM` site runs on every GM client, a claimed
   landing is never re-driven when its claimant drops, and the connect race can let two clients pass
   `isActiveGM` before either claim lands. It is already bent in play (the bridge beside the DM's
   window; the 35-HP familiar of 2026-10-14) and will be bent on purpose with a co-DM. Loot Shelf has
   the largest double-write exposure outside the hub (21 `isGM` gates).
3. **Uniformity at the hub's edges.** One sanctioned popup gate, one creature picker and one flag
   serializer exist, and beside each a tail of hand-built sites the static gate does not see: raw
   `DialogV2` in four machines and two confirms, 114 direct `ChatMessage.create` sites with no shared
   poster, 122 raw `setFlag` beside 181 serialized writes (21 of them read-modify-writes, three on
   flags the serializer also writes), 21 raw `setTimeout` in thirteen machines, 613 `console.*`
   calls with no logger, 15 popup closes whose `catch` cannot catch, 12 world writes swallowed in
   silence. §5 has the audit. The picker gate (`check-pickers.mjs`, built on the owner's own ask for "a unified
   ui presentation that the ui rendering goes thru") is the pattern that already works: a machine
   describes, one renderer draws, a static check forbids the bypass. It has been applied to one of
   the five presentation shapes.
4. **The harness is a second codebase with its own bug classes.** 53k lines against 51k of module;
   five of the day's dozen red suites were harness faults; the largest suite is 7,137 lines; a
   suite that stalls on a platform dialog can poison every suite after it. The harness has no gate of
   its own beyond Biome.
5. **Cross-repo contracts are untested.** FX Studio plays from `bythebooks.moment`; Session Scribe
   reads By the Books' card flags under two scopes; the MCP names three modules by id and reports
   them. The integration map lists the references; nothing pins the shapes. A payload field renamed
   in the hub breaks a sibling silently, and the hub's own `check-moments` only proves the hub's half.
6. **The documents have become journals.** The suite's CLAUDE.md carries the deploy history of every
   release in its Conventions section; By the Books' 131k words are loaded by every session that
   touches it; the State-block rule exists and is kept by two siblings. The cost is context on every
   session and staleness nobody measures: `check-doc-links` catches a dead link, not a dead fact.
7. **The family's discipline stops at the hub.** Seven of the nine modules have no tests and no
   gate; the only socket user (Loot Shelf) has none and no lock in its kernel; receipts are built
   three ways (the hub, Loot Shelf, Party Stash) and the last two collide; twenty-three raw patches
   on private platform methods sit outside the upstream watch; and the suite README promises a
   one-click revert on shelf trades and stash transfers that neither module has. §6 has the
   per-module list.
8. **The MCP's ceiling is a wall, and it measures the wrong client for the owner.** 13 chars of
   headroom; the 4.6.0 lights work paid by trimming prose that the M7 diet had already cut; and
   Claude Code, the owner's daily client, defers and flattens schemas, so `manage-placeables` shows
   the tiles' fields for every kind. The [companion analysis](2026-10-15-mcp-tool-surface.md) has
   the numbers and the recommendation.
9. **No i18n, by choice.** Nine public modules, zero `lang/` folders. Not a defect for one table; a
   growing cost for a public family, and the cheapest it will ever be is now.

## 5. The hub: where the approach is not uniform

The audit read By the Books against its own ARCHITECTURE. The rules the tools check do hold:
`decide/` has no Foundry reference and no import; the registry's 1,021 rows carry no function;
every one of the 46 suites imports the shared harness; the main helpers are used (`bfCard` builds
95 of 114 chat posts, `openMomentPopup` opens 45 popups, `momentButton` has 56 sites,
`queueFlagWrite` 181). The drift sits one level down, in the code around those helpers, which was
never lifted into one and is copied ten to thirty times with small differences. The five sharpest
findings were re-read in the code before they went here.

**Where a difference changes behaviour, not just looks:**

- **Three read-modify-writes bypass the serializer on chat flags**, against state law 2.
  `clock-riders.js` replaces the whole `riders` array of `clockRiders` from a stale read, a flag
  `queueFlagWrite` writes five times elsewhere; `hit-menu.js` writes `{...record, done: true}` after
  a long await, racing the queued `effectsApplied` claim and `picks[].pressed`; `ui.js`
  `acknowledgeMoment` deep-clones any machine's flag and sets it back, while its own relay path in
  the same function uses the queue. Off chat, the same shape on an effect's `recoiled` map, a
  `rerollUsed` append, and two region lists in `emanations.js`. About 31 raw read-modify-writes
  on chat messages in all (the landing found three more racing the queue: the emanation's pick,
  the rebuke's followed mark, the aura sweep's member-effect repair); the other raw `setFlag` sites
  on messages are birth stamps, which the law allows. (Landed as row 2 the same day, `1f87944`:
  ten routed, 21 one-writer sites pinned in `check-serializer`.)
- **Who owns a decision clock is chosen five ways.** `armAskTimer` serves 10 timers and hard-codes
  `isActiveGM()`, so those clocks never start with no GM (against presentation law 11); 16
  hand-written sites in 15 machines plus the hold's write the same shape on `armDeadline` with
  `keepsMessage`, `drivesMomentFor` or `isContinuingClient` instead; `auto-damage.js`'s offer
  buzzer is a relative `setTimeout` with no `deadlineIsLive` and no re-arm on reload. Fourteen of
  these timer machines are missing from §3's driver table. (Landed as row 1 the same day,
  `164485b`; the ten elect-owned clocks stay so by a recorded choice, see HANDOFF.)
- **Fifteen copies of `try { void open.close(); } catch {}`** in eleven files: the `void` drops
  the promise, so the rejection the catch is there for escapes it anyway. `ui.js` has the right form
  once (`await open.close()`).
- **A Revert clicked on two GM screens refunds a ward twice.** `receipts.js` writes the ward's
  uses back before it marks the entry `reverted`; the HP restore is idempotent, the refund is not.
  Suite issue #8's `isGM` audit for the hub: of 15 `game.user.isGM` sites, five are presentation
  and seven are a click that writes (Dismiss, Revert, Change the form, Topple's "failed", the
  emanation answer, metamagic's author fix, the `leadWindow` claim).
- **Twelve world writes are swallowed with an empty `.catch(() => {})`** (`cast-riders`,
  `damage-rules`, `damage-shields`, `dice-changers` ×2, `emanations` ×2, `heal-on-hit`,
  `hold/continue`, `rest-grants`, `use-chips`, `ui.js`); 26 more are the deliberate
  `fromUuid(x).catch(() => null)`. 24 unguarded `fromUuidSync` calls throw on a bad uuid
  mid-render where `resolveUuid` (247 uses) would not.
- **The `saves` flag is read directly in nine machines** (14 raw `readFlag(…, "saves")` and one
  direct write in `area-ask.js`) where §4 says only `saveDemandData`, `saveTargetEntry` and
  `verdictsOn` may touch it; `verdictsOn` is used at two of the fifteen outside sites. Forty-nine
  flag keys are read outside the file that writes them, at 159 sites in 50 files (`receipt` in 11
  files, `saves` 10, `hold` 7; Appendix C has the map); `npm run layers` sees import edges, not
  flag edges. `summons.js` writes the `transform` flag that `transforms.js` owns.
- **One in-memory window is undocumented:** `metamagic.js`'s 3-second expiry is not in §4's
  accepted trade-offs table.
- **One debt row is open in the tool and closed in the prose.** `npm run layers` reports
  `saves/verdict.js → receipts.js` as `OPEN (D9)`; ARCHITECTURE §10 says "today nothing is owed"
  (BACKLOG parks the edge; the three documents should agree).

**Where it is drift in shape, the owner's concern:**

- **Popups.** Four raw `DialogV2` constructions (`auto-damage`, `gear-lights`, `mastery-record`,
  `volleys`) and two `DialogV2.confirm` (`shared.js`, `summons.js`) beside the 45 through
  `openMomentPopup`. Three exist because they need "Escape fires" and a buzzer, which
  `openMomentPopup` has no option for; `mastery-record` calls `dialog.render` directly, so repeated
  header clicks stack windows; the two confirms skip the cascade, the keyboard default and
  `livePopups`.
- **Picks: at least four shapes.** `tickRowsHTML` (7 calls); the "radios with one Apply button"
  bystander popup copied three times with its mute dispatch (`bystanders.js`, `damage-holds.js`,
  `hold/views.js`); one button per option (`saves/choices`, `damage-rules`, `gear-lights`); rescue
  rows as buttons in the content; the gallery's own reader. Ten hand-written `<input>` sites in
  machines, eight box builders in `decide/present.js`, about thirty `querySelector('input[name=…]:checked')`
  reads across 17 files. `check-pickers.mjs` forbids hand-drawn picks in 2 of 77 machines.
- **The pending card row, copied 27 times** in 23 files: bar, show-once latch (31), Answer button
  (26), timer. §5 says the spine owns latches.
- **Cards: the HTML has converged, the envelope has not.** 114 `ChatMessage.create` sites in 46
  files; `postCard` is local to `gear-lights.js`. Speaker built five ways (`getSpeaker` ×100,
  `{alias: TITLE}` ×11, one literal "By the Books", `card.speaker` ×2); whisper lists five ways (the
  GM list inlined ×10, `[game.user.id]` ×6, owners only, owners plus GMs built two ways, self plus
  GMs). The relay's receiving side is one registry (21 registrations); its sending side is 20
  hand-written envelope posts, seven of them the same "no GM? warn, else whisper the GMs" block.
  Two public cards post without `bfCard` (`cast-riders.js`).
- **Logging.** 613 `console.*` calls with three prefixes (`${TITLE} |` 608, `${MODULE_ID} |` 5,
  a literal 2); four separate warn-once sets; 78 notifications in three styles; two ways to say
  "no GM" (`whisperNoGM` ×21, a notification ×5).
- **Lookups and labels.** `tokenForUuid` copied word for word (`geometry.js`, `dice-rise.js`);
  the token-for-actor chain inlined in five files, a shorter one in four more, and five sites that
  return a placeable where a document is expected; the writable-targets guard repeated five times;
  "can still react" (`hp <= 0 || incapacitated`, a rules judgment that belongs in `decide/`)
  repeated six times; activity-by-name with seven semantics (one exact where the shared helper is
  lenient); the kept d20 face read four ways; eleven local capitalisers beside one site that reads
  `CONFIG.DND5E` labels; the stale-effect delete idiom ten times.
- **The registry.** 171 exports: 91 object tables, 11 arrays, 10 sets, 59 functions (54 of them
  one-line `*Entries` accessors). 268 of 698 names appear in two or more tables, 11 in four or more
  (Battle Familiar in five), and each repeats its book pointer (685 `rule:` entries). The R4
  tripwire pins 40 kinds across 8 sets; the vocabulary of the other ~90 tables (`atZero`, `drops`,
  `gate`, …) lives in §6 prose only. 56 `says:` lines carry rule sentences in the module's words,
  outside the rule-fold check. `decide/` has seven `Date.now()` calls and one `console.warn`.
- **The harness.** All 46 suites share the Node side; the in-page side is copied per suite:
  `sleep` defined 65 times, the generic poll 51 times in 15 forms with five default timeouts,
  `ok` in 4 variants, `want` in 6, the settings snapshot in 10, and 1,001 bare `sleep(n)` waits
  summing to 578 s, which is the polling that went red on Foundry 14.369 (Appendix D).
  `smoke-classes.mjs` at 7,137 lines is 127 sections; its size is scenarios.

**The helpers, ranked by sites × risk:**

| # | Helper | Sites | Why first |
| --- | --- | ---: | --- |
| 1 | `armAskTimer(…, { owns })`: who owns the clock as a parameter (elect, keeper, subject, continuing) | 15 copies, 5 rules | a clock that never starts with no GM, or starts twice |
| 2 | every read-modify-write through `queueFlagWrite`, then a writers-style check that fails `setFlag(k)` after a read of `k` | ~25 | lost array entries, a consequence applied twice |
| 3 | `pendingRow(message, html, { bar, latch, answer, arm })` in `ui.js` | 27 rows | the spine owns latches; about 300 lines net |
| 4 | `closePopup(message, sub)` that awaits and catches | 15 broken copies, 40 `livePopups.get` outside `ui.js` | popup law 4 |
| 5 | owner-exported flag readers (`verdictsOn`, a receipt reader, a hold reader) and a flag-edge check beside `check-layers` | 40 cross-machine keys | wire-format drift with no edge to show it |
| 6 | `postCard` / `postAnswer` / `gmIds` / `ownersAndGmIds` | 114 creates, 20 senders | visibility drift |
| 7 | one pick builder (`tickRowsHTML` + `picked(form, name)` + `choicePopup`) and `check-pickers` over every machine | 3 copied popups, 10 inputs, ~30 reads | the owner's UI concern |
| 8 | `tokenDocOf(actor, activity?)` in `geometry.js` | ~25 | mixed return types |
| 9 | `resolveUuid` everywhere, `writableTargets(targets)` | 24 + 5 | throws mid-render |
| 10 | `log.*` in `core.js`; no world write swallowed without a name | 613 calls, 12 silent | low each, everywhere |

Next in line: `canReact(actor)` in `decide/` (6 copies), `activityNamed` everywhere, a
`typeLabel` on `CONFIG` (21 sites), the in-page suite prelude (46 suites), a `RULES` table keyed by
name for the repeated book pointers, and `openMomentPopup` gaining `onDismiss` and a buzzer so
`openManagedPopup` can go private.

## 6. The family beyond the hub

The survey covered the eight other modules and the two small servers. Its sharpest findings were
re-read in the code before they went here. Line counts are shipped code (`scripts/` or `src/`).

| Repo | Shipped | Offline tests | CI | Elect / single writer | Raw patches | Reads a sibling |
| --- | ---: | ---: | --- | --- | ---: | --- |
| combatplus | 8 files / 1,127 | 0 | none | `activeGM?.isSelf` | 4 (`Token#_canView`, `#_onClickLeft2`, two GM Vision mixins) | Loot Shelf's flags directly, not its `api.isMerchant` |
| lootshelf | 10 / 2,808 | 0 (3 live checks) | none | `activeGM !== game.user` in the GM-proxy kernel | 8 | none in shipped code |
| partystash | 1 / 1,974 | 0 (5 live checks) | none | the acting client | 5 | none |
| areasounds | 6 / 1,174 | a 53-check engine test nothing runs | none | `activeGM?.isSelf` | 0 | its own old id (rename fallback) |
| fxstudio | 35 / 5,343 | 9 `check-*.mjs`, run only inside `build-release.ps1` | none | the message's author, else the lowest-id GM, role ignored | 0 | By the Books and its old id |
| errata5e | 7 / 312 | the register check | check.yml, upstream-watch.yml | memory only | 4 (`prepareBaseData` ×2, `applyActivity`, `prepareFinalData`) | none |
| autoexplore | 1 / 118 | 0 | none | no world writes | 2 (`FogManager` internals) | none |
| openserver | 1 / 119 | 0 | none | `isGM` and `activeGM === self` | 0 | none |
| mcp-imagegen | 19 / 2,781 | 134 (+9 Python) | none | — | — | — |
| mcp-sessionscribe | 37 / 4,978 | 140 | ci.yml (builds the dnd5e MCP from `main`, unpinned) | — | — | By the Books' card flags, both scopes |

Twenty-three raw prototype patches across the family and no libWrapper; no `lang/` folder anywhere.

**Two public promises the code does not keep.** The suite README says every trade at a shelf and
every transfer from the stash posts a receipt "with a one-click revert". Neither module has a revert:
both post a plain HTML chat line with no flags (Party Stash's internal `undo` is the compensation for
a failed move, not a user action). And the suite's own CLAUDE.md says Loot Shelf "knows" Party Stash;
Loot Shelf's shipped code never references it (the one hit is a verify tool). Fix the words or build
the feature; today the README over-promises.

**Contracts between repos are prose, and two have drifted:**

- **By the Books to FX Studio.** By the Books gives every word of one resolve the same `momentId`;
  FX Studio's `firstHearing` de-duplicates on `momentId` alone (`scripts/readers/bythebooks.js`), so a
  moment that publishes two words (Parry: `hold-answered` and `maneuver`) plays only the first. FX
  Studio's own check fixture carries `version: 1` and a `'whole'` marker where the hub now emits
  `'message'`; it never reads `version` or `api.moments`; its gate reads the hub's internal
  `flags.metamagic.chosen`. It acts on 5 of the hub's 17 words and logs every other as a skip,
  unconditionally. It never reads `details.answer` or `outcome`, so a declined reaction plays like an
  accepted one (traced in code, not observed at the table).
- **By the Books to Session Scribe.** The scribe's `BF_KEYS` names 28 flag families
  (`src/page/combat-stats.ts`); the hub's `decide/moments.js` classifies 54 keys today, 3.4.7's
  `damageHold` among the unread. Damage and healing totals are unaffected; per-actor moments and
  spends are under-counted, and the report does not say that families were skipped. The scribe's
  fixtures are hand-built from a 2026-08-27 scan.
- **Area Sounds to the dnd5e MCP.** The MCP mirrors the module's `normalizeSet` in TypeScript and
  tests the mirror against hand-typed values, never against the module's `engine.js`.
- **Three writers on Dead / defeated.** Combat Plus's auto-defeated (on by default for PCs and NPCs),
  By the Books' receipts (which carry a copy of Combat Plus's combatant matching), and dnd5e's own
  Apply Downed Conditions. The hub's pointer to "the combatplus contract (ARCHITECTURE.md §7)" in
  `decide/receipt.js` leads nowhere.

**Seven ways to pick the single writer, one of which handles a GM in two windows.** Only the hub
asks `leadsWindow()`. With the same GM in two windows, Loot Shelf's kernel answers every player
request once per window (a purchase lands twice), Combat Plus marks defeated and starts the combat
music twice, and FX Studio's elect (`readers/dnd5e.js`) can pick a different client from `activeGM`.
This is the family half of suite issue #8.

**Receipts three ways, two of them copy-pasted, and they collide.** Loot Shelf and Party Stash share
an identical `planDeduction`, a `receiptWhisper` three lines apart, and duplicated `RECEIPT_MODES`
settings that have already diverged (Party Stash has an on/off switch, Loot Shelf none). A Loot Shelf
sale that pays into a group actor also fires Party Stash's `updateActor` hook, so one sale posts two
lines. Actor and item names go into chat HTML unescaped in both (`transfer.js`, `partystash.js`);
Combat Plus escapes, and the hub has `esc` and a static check for it.

**Two-document writes differ in order and have no lock.** Party Stash and Loot Shelf's item moves
credit before they debit; Loot Shelf's purchase takes the coin first and swallows a failed refund
(`transfer.js` `.catch(() => {})`), and its sale deletes the item before paying. The kernel has no
per-merchant lock, so two buyers of the last item both pass the stock check across the awaits; Party
Stash writes whole currency objects from each client's local copy, so two deposits at once lose one.
The kernel also takes the requester from the payload's own `userId` (the sender stamps it), which is
fine at a trusted table and worth a line in its README.

**Patches the watch cannot see.** `watch/surface.json` lists hooks, documents and API names; it
contains none of the 14 private methods the family patches (`_canView`, `_onClickLeft2`,
`_defaultDropBehavior`, `_onDropCreateItems`, `FogManager#_handleReset`, dnd5e's `prepareBaseData`
and `applyActivity`, and the rest). The Combat Plus and Loot Shelf chain on `Token#_canView` is
robust to load order (each defers to what it found) and fragile to a module that replaces the class
after setup or overrides without `super`; the two wrappers also differ in fidelity (Loot Shelf returns
`true` before core's own non-permission refusals, Combat Plus keeps them), and neither is tagged.

**Where user-authored data lives.** Area Sounds keeps its library outside the module folder on
purpose, because an update reinstalls `modules/<id>/`. FX Studio ships the House inside the module
and zips it on release, so an update replaces a public user's House, one House serves every world on
an install, and prod is protected only by keeping the repo's copy byte-identical by hand.

**Conventions that exist three ways.** Settings: one init hook (Combat Plus, Party Stash, FX
Studio), scattered (Loot Shelf), none (four). Log prefix: `${MODULE_ID} |` in five, `${TITLE} |` in
four (Errata's title string is not its Foundry title). The API appears at `init` in two modules and at
`ready` in two. Only the hub's moments carry a version. `fxstudio.rebuilt` is emitted and not in FX
Studio's README, which the hook rule requires. Releases happen three ways: a hand-built zip
(five modules), a PowerShell `build-release.ps1` (FX Studio, Errata) while the dev box is moving to
headless Ubuntu, and the hub's `release.yml`. Five modules depend on `file:../fvtt-mcp-dnd5e` for
their live checks, with six local copies of `assert` and three ways of importing the client, so a
public clone cannot run its own verify tools without the sibling.

**The two small servers.** Both copy the dnd5e MCP's zod-to-schema code and registry pattern without
its receipts, error mapping or budgets. imagegen's schema conversion lacks `additionalProperties:
false`, so a typo in an argument still buys a paid render; its `edit-image` description is 1,281
chars against the family's 400 with no ceiling test; its cutout's Python child has no timeout and
its first run downloads about 176 MB inside the call; spend is recorded after post-processing, so a
billed render that then fails goes uncounted; no CI; its CLAUDE.md status says 1.0.0 at 1.3.1.
Session Scribe: an unset or misspelled `FOUNDRY_HOST` resolves to the hosted preset, so a mistake
reads prod (the dnd5e MCP refuses an unknown host instead); `tar.exe`, the Edge path and the venv
path are Windows defaults that the Ubuntu move breaks; its Python worker is handed the whole
`process.env`, Foundry password included; `build-transcript` overwrites `transcript.md` without the
guard its other writers have. FX Studio also drops an FX that fails validation from the Library
without a word, and its async `setup` load is not awaited, so an early moment can play nothing.

**Strong, and to keep:** Errata's shape (one file per fix that is a no-op once the vendor's data is
right, a register the checker parses, a "retire when" column per row, issue-first work, a daily
watch with 97 upstream reports cited); fail-soft patching everywhere (every wrap checks the method
exists and logs what stops working); Loot Shelf's GM-proxy kernel re-checking price, stock and
ownership on the GM side; Combat Plus riding document hooks only, so any tracker works; Area Sounds'
rename handling; FX Studio's nine offline checks gating its zip; the two servers' clean stdout and
Session Scribe's per-read child process with watchdogs.

## 7. The MCP server

The 3.0 design holds: one registry, schemas generated from zod, error codes that ride across the
page boundary with a hint per code enforced by the type system, receipts recorded per document under
a page-side write lock so undo needs no per-op code. `npm test` is 2,033 tests in 109 files; the
skills matrix reports 0 unresolved names. The problems are at the edges.

- **"Maintenance" is not what is happening.** CONTRIBUTING and design.md say the project has been in
  maintenance since 3.0.0 with no roadmap. Since 4.0.0: 68 commits, 12 new source files, 5,790 lines
  added, and five releases of new capability (receipts and undo, `run-script` and a new toolset, the
  read-only mode, `init` and `doctor`, seat records, the op cap, the lights whole, `asToken`).
  design.md never mentions any of them, against its own §9 rule that a capability is written there
  first. The tool-surface ceiling is the symptom; this is the cause.
- **The ceiling has 13 chars of headroom and measures an eager client.** The owner's client defers
  and flattens; `manage-placeables` reaches it with one kind's array shapes. The companion document
  has the measurements and the three-budget policy that replaces the single wall.
- **Typing stops just past the call.** The seam guard checks only the top level of each argument
  and result: 65 of 157 page results and 9 arguments carry `any` inside; 82 handler signatures take
  `args: any` and 39 formatters take `result: any`, so the typed page result is thrown away at the
  formatter. 1,204 explicit `any` in 106 of 152 non-test files (`page/scenes.ts` 56,
  `page/dnd5e/advancement.ts` 47, `page/actors/reads.ts` 41); Biome's `noExplicitAny` is off.
- **Some failures look like successes.** The assets family (12 tools) and `export-chat-log` return
  misses and refusals as successful text ("Refused: …"), and the tests lock that in; the PC
  advancement rollback returns `{success:false}` as a normal result with no `isError`, which
  `docs/RELEASE.md` records as expected. The `rolled-back` error code exists, has a hint and a test,
  and is thrown nowhere. design.md §3 says a miss is an error.
- **Irreversible writes with no receipt and no warning.** A call that writes no Foundry document
  gets no receipt line and no "not undoable" note, so it reads like a read: `delete-asset`,
  `move-asset`, `copy-asset`, the uploads, `pull-users-to-scene`, `export-chat-log` with a remote
  path. The README's "every write tool answers with a receipt" is untrue for the one irreversible
  delete, and no test lists the writes that can finish with zero document changes.
- **Fuzzy lookups pick the first substring match on writes.** One fuzzy actor resolver imported
  under three names at 32 call sites, no ambiguity check; the strict lookup re-inlined three times;
  four user-lookup rules in five places. Open issue #19 (a token id writes to the base actor) is
  this seam.
- **Duplication.** The authoring result wrapper copied 15 times (summary repeated inside the
  message, ids twice, 75 emoji lines against the error mapper's own "no markdown/emoji");
  "create one embedded item, then guard" 17 times with an uncoded throw and no veto check (the
  create-side twin of the delete veto fixed in 4.6.x); add-feature's eight mode handlers each
  repeating parse → log → `assertDnd5e` → call → format, with 28 `assertDnd5e` calls across 13 files.
- **The page API is public through `run-script` and has no version and no gate.**
  `docs/run-script-api.md` has been stale since 2026-10-11 (`scripts/measure/run-script-api.mjs
  --check` exits 1 today); nothing runs that check.
- **Live proof is unmapped.** 64 verify scripts (17,929 lines) and 7 integration files (88 cases),
  but only a 14-script release set is tied to families, its descriptions have drifted ("the 32
  placeable tools"), and journals, tables, cards, playlists, assets, users/settings and combat have
  no release-set proof. Six tools have no live proof at any level, `screenshot-scene asToken`
  (4.6.0) among them. 18 page modules (about 5.3k lines) have no test file of their own.
- **The hosts rule has leaked.** `git grep MOLTEN_ src` answers six files, not the two the rule
  allows; `client.ts` labels a host "prod (Molten)" in library code.
- **Small, sharp:** `vitest.config.ts` does not exclude the gitignored `scratch/`, so a scratch
  `*.test.ts` on one machine changes the gate's count there (found today, by me, the hard way).
  `page/compendium.ts` skips a pack that fails to index without a warning, so a search's
  `totalFound` can be quietly short; `getOrCreateFolder` returns `null` on failure and the document
  lands in the root folder unannounced.

The two small servers copy this server's schema code without its receipts, error mapping or
budgets (§6).

## 8. The path forward

The family already has the right habit: a structural change is a pass, each pass lands with a
check that pins it, and the check is what stops the drift from coming back. The passes below are in
the order the risk and the cost argue for. None of them adds a rule to the module; all of them
make the next rule cheaper and the next release safer. Each names what "done" looks like.

**Pass 0, this week: the release stops outrunning the proof.** A By the Books release carries the
battery that proved it: the tag body names the run under `dist/battery/` (the harness already
writes one), `battery.mjs --changed` is the floor for a patch and the full battery for a minor, and a
release without a run is published as a GitHub pre-release and never reaches prod through
`register-module`. Pay for it by making the battery cheaper to run: split `smoke-classes.mjs`
(7,137 lines, a fifth of the battery) by class so `--changed` selects a class; replace the 1,001
bare waits (578 s, a fifth of a run, Appendix D) with one injected poll, starting with `classes`,
`emanations` and `hold`; retire the count pins that go red on every feature; and give the
harness its own static gate (it is 53k lines with no check but Biome's). Done when the next three
releases each name their run and the "owed battery" phrase has no occasion to appear.

**Pass 1: the presentation pass in the hub.** The owner's ask, and §5's ranked table is its work
order. Two of its rows are correctness before they are uniformity and go first: the clock's owner
as a parameter of `armAskTimer` (the no-GM clocks that never start), and every read-modify-write
through `queueFlagWrite` with a check that fails a raw `setFlag` after a read. Then the shapes,
with the picker gate as the template (a machine describes what it asks, one renderer draws it, a
static check forbids the bypass): the pending card row, `closePopup`, the owner-exported flag
readers with a flag-edge check beside `check-layers`, `postCard` with the whisper policy and the
relay's sending side, one pick builder with `check-pickers` over every machine, the token and uuid
lookups, the logger. Raw `DialogV2` ends up allowed only inside `ui.js` once `openMomentPopup` can
fire on dismiss and carry a buzzer. Each shape gets its `check-*.mjs`, so the gate holds it. Done
when the counts in §5 read one file each and `npm run verify` fails on a new bypass.

**Pass 2: two GM clients.** Suite #8's own order: the two-GM harness mode and the connect-race
measurement first (it decides whether the claim needs a user id), then the claim with its user and
the re-drive when that user is gone, then the `isGM` audit with every site tagged presentation or
consequence. The family half is Pass 4's `elect.js`. Done when `smoke-companions` and
`smoke-summons` each have a two-GM section asserting one landing per record.

**Pass 3: contracts across repos.** The emitting repo owns `contracts/<name>.json`: a schema, a
version, and payloads its battery recorded. By the Books publishes the moment payload and the
card-flag keys; FX Studio and Session Scribe load them from the sibling clone in their tests and
skip when it is absent; the MCP's Area Sounds mirror is tested against the module's `engine.js`. In
the same pass: FX Studio de-duplicates on `momentId` plus `event` and reads `outcome`; the scribe
reads the 26 keys it misses and says when a family is skipped; the three writers on Dead become one
rule written in one place. A suite `contracts --check` reports each consumer's version against its
emitter's. Done when a renamed field in the hub fails a sibling's test before it ships.

**Pass 4: the family kit, vendored, never shared.** "Every module installs alone" stays; the
helpers travel as byte-identical copies, the way the README sections do. Five files: `elect.js`
(`activeGM.isSelf && leadsWindow()` under the module's own scope), `wrap.js` (a tagged wrapper that
checks the seam, logs the consequence, refuses a second install, uses libWrapper when present),
`receipt.js` (delivery policy, escaping, a versioned flag, an options marker so a sibling's hook
does not echo), `log.js`, `settings.js`. A suite tool like `suite-sections.mjs` keeps the copies
identical. With it: a module template (Biome, Vitest, `verify.yml`, a `release.yml` generalized
from the hub's) and one reusable workflow in the suite, so the hand-built zips and the two
PowerShell release scripts retire, which also pays part of the Ubuntu move. `upstream-surface.mjs`
gains a `patched` set so the watch sees the 14 private methods the family wraps. Done when every
module releases from a tag, Loot Shelf and Party Stash share one receipt and post one line per
sale, and the watch's next review issue lists a patched name.

**Pass 5: the docs recut.** CLAUDE.md carries rules; dated history moves to a log per repo
(`docs/log/` or the CHANGELOG), the way PLAN.md once moved into ARCHITECTURE's appendix. The State
block rule applies to every sibling that has a CLAUDE.md; the public claims in §9 are corrected or
built. One suite check: no date in a CLAUDE.md outside its State block. Done when the suite file is
under a third of its size and a session's first read is the rules, not the journal.

**Pass 6: the MCP.** The companion document's five steps (the three budgets, the flatten-safe
placeables, the smaller lossy keys, the client measurement, design.md naming 4.x), then the
correctness edges from §7 in this order: failures as `isError` (the assets family, the rollback,
`rolled-back` thrown), the no-receipt tag and its "not undoable" line, the ambiguity refusal on
fuzzy writes (#19), `run-script-api.mjs --check` in `npm test`, `scratch/` excluded from vitest,
the `MOLTEN_` leak back inside `src/hosts`. Done when the README's receipt sentence is true and
`npm test` prints three budgets with their payers.

**Standing rules the passes add to.** A platform pass per dnd5e minor stays its own step. A rename
follows Area Sounds' pattern (read fallback, GM-load migration, a warning beside the old package).
A new rule is still a row, a unit test and a suite section; a new module starts from the template;
a new hook is documented in the emitter's README and carried in its contract file.

What this buys: a family where the next book, the next sibling and the next maintainer each start
from a template and a gate instead of a precedent found by reading. The hub already works that
way. The passes extend it to its edges and to the rest of the family.

## 9. The misses

What is known and not done, so the path forward starts from an honest ledger.

**Open by issue.** Suite #8 (two GM clients; the measurement is step one), #5 (the Ubuntu move;
the concrete blockers found today are Session Scribe's Windows defaults and the two PowerShell
release scripts), #4 (fold Errata's version step into the watch). By the Books #13 (Produce Flame
and Continual Flame as token lights), #1 and #2 (summons and Wild Shape, built and in testing). MCP
#18 (the ceiling), #19 (a token id writes to the base actor, the fuzzy-lookup seam), #20
(`create-pc` prepared spells land unprepared).

**Rules waiting on a first customer.** WAIT rows in the registers: Arcana Unleashed 24, Heroes of
Faerûn 16, Ravenloft 14, the Monster Manual 12, the DMG 7, the classes 2. Parked with a trigger: the
epic boons of every book (the PHB's plus 16), four PHB feats (Charger, Grappler's two, Mounted
Combatant's rest, War Caster's Reactive Spell), Warlike Familiar's two benefits, cover against an
area's save. Scoped out for good by the user: the reaction-AC items, the DMG's two optional rules,
the redirect and cast-triggered reaction kinds. Portent's open questions are W2 and W3 of its test
handoff.

**Proof that was never run.** Area Sounds' 53-check engine test (no npm script runs it); FX
Studio's nine checks outside its zip build; Errata's pure functions exported "so a suite can test
it without a world" with no offline test; the MCP's six tools with no live proof and its stale
`run-script` API reference; the hub's one never-fired hook (`dnd5e.advancementManagerComplete`),
rare by nature and still unexplained.

**Public words the code does not keep.** The suite README's one-click revert on shelf trades and
stash transfers; the suite CLAUDE.md's "Loot Shelf knows Party Stash"; the MCP README's "every
write tool answers with a receipt"; FX Studio's README listing a `templates/` folder that does not
exist; Loot Shelf's HANDOFF header at 1.2.4 with the module at 1.3.1; `partystash.js` saying
receipts are whispered when they have been public since 1.3; `lootshelf.js` saying the MCP drives
its API when no MCP source names it; `fxstudio.rebuilt` emitted and undocumented.

**By choice, and getting dearer.** No i18n in nine public modules. One House for every world on an
FX Studio install, shipped inside the module. The whole-log scans. Effects found by name.

## Appendix A. The bug classes across forty releases

What actually broke, read from the release notes of v2.0.4 through v3.4.7 and the battery records
of 2026-10-13 and 2026-10-14. A fix is counted once, under the class that explains it. The point
is not the count but the shape: the classes say where edge cases bite as the fine-tuning starts.

| Class | What it looks like | Fixes on record |
| --- | --- | --- |
| **Content shape**: the pack's data is not what the row assumed | Fortified Familiar counted twice because dnd5e's feat grant already carries the enchantment (3.4.6); the Survivor name shared by two feats (2.12.0); Smite of Protection's effect id, Unbreakable Majesty's missing row and flag key, a bearer ring's source, Peerless Skill's raw formula (2.9.0); a summon's own `@mod` dropped from its dice line (3.4.3); an empowered familiar wearing the form's token ring (3.4.6); the slot box re-ticked once the free cast was spent (3.4.6); the Celestial vestige and the Strength-attacking PHB creatures, fixed in Errata 1.2.2 | 9 |
| **Double application**: the same consequence landed twice | the downed condition out of combat (3.4.7); Superior Hunter's Defense halved twice (2.9.0); two familiars and two effects from one summon with the GM in two windows (3.3.0); the 35-HP familiar of 2026-10-14, suspected connect race, unresolved (suite issue #8) | 4 |
| **Platform timing**: the module acts in a window the platform also acts in | a reverted kill racing dnd5e's removal of the downed condition (3.4.7); the GM not yet counted active at `ready`, so the visibility sync skipped (2.16.1); three setting writes landing one by one, a client closed mid-window keeping one (2.16.2, Battle Flow issue #5); a recast past the dialog asking about ending its own Concentration (3.4.3) | 4 |
| **State lifecycle**: a flag or effect not lifted, a card not told | a locked Sleep no longer ending on damage and its Unconscious never lifted (3.4.7); Concentration ending on Polymorph without marking the card (3.4.0); a reroll erasing the hit's damage record, and a deleted key not deleting (2.7.0, the serializer) | 3 |
| **Wrong client**: which client acts | six writes that could run on every client, gated (2.6.0); the hold's GM quiet on top of `canAnswerFor`, so an offline player's Shield popped for nobody (2026-09-27); the leading window (3.3.0) | 3 |
| **Presentation arithmetic** | the receipt row's trait label dividing the caller's multiplier out (2.0.7) | 1 |

Three readings:

- **Content shape is the largest class, and it is the one the architecture invites.** N1 says the
  module never stores an amount and reads everything off the content, which is right, and it means
  every row is a bet on the pack's shape: an enchantment that rides a grant, a name two feats share,
  an effect id, a formula with `@mod`. The probes exist for exactly this (`probe-pack-shapes.mjs`,
  `probe-premium-module.mjs`), and `check-identifiers` pins names, not shapes. The fine-tuning phase
  will be mostly this class. A shape assertion per row kind, generated from the installed packs the
  way `dnd5e-hooks.json` is generated from the system, is the check that would catch it offline.
- **Double application and platform timing together are the second shape, and they are one
  problem seen twice:** the module and the platform both act on the same document in the same
  tick. Every fix in both classes was "do it in the same update" or "claim it first". The
  serializer and the `applying`/`claimed` stamps are the right tools; the §5 bypasses are where
  the next one comes from.
- **Nothing on record was a decision logic error.** No fix says "the rule was wrong". The rulings
  process and the `decide/` tests are doing their job; the bugs live at the edges the pure layer
  cannot see.

**The harness's own defects, the same two days**, which cost more battery runs than the module's:
`smoke-metamagic` was red in 11 of 14 battery invocations on 2026-10-13 for three different
reasons (§20h "Cannot read properties of null (reading 'getFlag')" seven runs in a row before two
green, then §9z's timing, then §15a–c), the battery was invoked 14 times that day (2 full, 12
partial re-runs) and 5 times the next; `smoke-spells` §10's Sleep template waited out the 600 s
watchdog in two full runs; the 2026-10-14 evening run had 14 red suites, all hygiene (a foreign
combat, the house rule on, the Prone leftovers); `smoke-saves` §32 was called a dialog flake for
five days before it was found to be a dead-victim race; `smoke-surfaces` went red because a
thirteenth setting was added and the suite pins "exactly the twelve". A suite that pins a count
is a suite that goes red on every feature.

## Appendix B. Where the battery's minutes go

From the file timestamps of the green run of 2026-10-14 (23:32, 55 entries, 50.6 min): each
entry's duration is the gap to the previous entry's output file.

| Entry | Seconds | Share |
| --- | ---: | ---: |
| smoke-classes | 597 | 19.7% |
| smoke-saves | 305 | 10.1% |
| smoke-emanations | 120 | 4.0% |
| smoke-expiry | 114 | 3.8% |
| setup-fixtures | 103 | 3.4% |
| smoke-maneuvers | 99 | 3.3% |
| smoke-hold | 90 | 3.0% |
| smoke-metamagic | 82 | 2.7% |
| smoke-reminders | 79 | 2.6% |
| smoke-savage | 77 | 2.5% |
| smoke-effects | 75 | 2.5% |
| smoke-monsters | 72 | 2.4% |
| the other 43 entries | 1,223 | 40.3% |

Two suites are 30% of the battery and one of them, `smoke-classes`, is 127 sections in one file,
so `--changed` can only take it whole. `smoke-expiry` varies between 71 and 114 s across runs
because it waits on the platform's own expiry clock. `setup-fixtures` went from 15 s on
2026-10-13 to about 100 s on 2026-10-14 after the prod re-mirror, which is worth a look (more
compendia to index, or the familiar fixtures). The two runs that carried the `smoke-spells` stall
were 53.0 and 59.8 min; without it a full run is 47 to 51 min. Where the minutes are waits:
`smoke-saves`' constant 300 s is the Decision Timer's buzzers being asserted (33 references to the
window and the buzzer, 12 s of fixed sleeps in 25 calls), which is real; `smoke-classes` carries
149 s of fixed sleeps in 278 calls, a quarter of its 597 s; the eight suites with the most fixed
sleeps carry about six minutes between them (`smoke-classes` 149 s, `smoke-emanations` 65,
`smoke-hold` 46, `smoke-splat` 34, `smoke-maneuvers` 27, `smoke-monsters` 19, `smoke-damage-rules`
18, `smoke-spells` 17). The levers, in order: split `smoke-classes` by class so `--changed` selects
a class; turn the fixed sleeps into waits on the write they wait for (`waitForWrite` exists in
`ui.js` for the module; Appendix D has the harness inventory); never pin a count a feature will
change.

## Appendix C. The hub's flag edges

`npm run layers` sees import edges. The module's real coupling runs through flags: a machine reads
another machine's flag by its literal key. An AST scan over all 146 files, keys taken from
`decide/moments.js` (235 keys: 55 moment records and 180 state keys), reads counted in every form
(`readFlag`, `getFlag`, `flags[MODULE_ID].k`, constants resolved through imports), `hold/` and
`saves/` each counted as one writer.

| | |
| --- | ---: |
| distinct keys | 235 |
| read only by their writer | 151 |
| read outside their writer | 49 |
| outside read sites / files | 159 / 50 |
| keys with outside writers / sites | 11 / 34 |
| keys never read in any counted form | 35 |

The keys with three or more outside readers, and whether the writer exports a reader the outside
files could use instead:

| key | writer | outside readers | outside writers | reader exported? |
| --- | --- | ---: | ---: | --- |
| `receipt` | auto-apply, receipts | 11 files, 18 sites | 0 | no: four actions, no reader; 7 truthiness checks, 7 scans of `.targets`, 4 whole-record reads |
| `saves` | saves/ | 10 files, 15 sites | 6 files, 8 sites | the §4 seam `verdictsOn` takes a flag value, not a document; 2 of 15 sites use it, 13 read fields directly (`sourceUuid` ×4, `targets[]` ×5, `demand` ×2, `scaling`, `templated`, `status`, the whole flag); 7 of 8 outside writes go through `saveDemandData` / `saveTargetEntry`, one folds in by hand |
| `hold` | hold/ | 7 files, 13 sites | 0 | no: actions only |
| `attackFor` | auto-damage | 4 | 0 | partly: `attackMessageForDamage` covers pre-create; the posted-message reader sits in `shared.js`, itself an outside reader; two files look it up in reverse |
| `attackHoldPending` | auto-damage, hold/ | 4 | 0 | no |
| `mastery` (the chip kind on effects) | six files | 4 | 0 | no; `reminders.js` carries two private copies of a `sourceUuid` accessor |
| `sourceUuid` | command, effect-riders | 4 | 0 | no |
| `effectReceipt` | effect-riders | 3 | 8 files | no: `revertEffect` is an action |
| `metamagic` | metamagic | 3 | 1 | no: `recordForRoll` is private |
| `metamagicAsk` | area-ask | 3 | 1 | no |
| `d20fold` | d20-folds | 3 | 0 | nothing exported; folding goes through `decide/verdict.js` |
| `fightingStyle` | damage-rules | 3 | 0 | nothing exported |

Files reading the most foreign keys: `reminders.js` (8 keys, 17 sites), `chip-spend.js` (6, 12),
`clock-riders.js` (6, 9), `auto-damage.js` (5, 11), `saves/demand.js` (5, 9), `cast.js` (5, 7),
`shared.js` (5, 5). A reader exported by the writer of each of the twelve keys above would
replace 95 of the 159 outside read sites in 40 files; the flag-edge check in §5's row 5 is what
keeps the number from growing back.

Three findings on the gate itself: two keys are written and missing from `decide/moments.js`
(`spellDamage`, written in `polish.js` through a variable and read by `hold/spell-hold.js`;
`migratedFrom`, written in `decide/migrate.js` through `flags[ids.to]`), because `check-moments`
misses a write made through a variable object; `tools/moment-writers.mjs` resolves constants across
the whole tree with the last one winning, so `clock-riders.js`'s `FORM_FLAG` (`"formChip"`) is
filed under `form`; and 35 keys are never read in any counted form, which is either a view reading
the whole flag or dead state, and is worth one pass to say which.

## Appendix D. The harness's waits

The 46 suites hold 110 `evaluate` bodies and 1,185 `sleep()` calls, all inside those bodies.

**Copied helpers.** `sleep` is defined 65 times. The generic poll (`until` / `waitFor`) is defined
51 times in 43 suites in 15 textually distinct forms (13 once numeric separators are ignored):
five default timeouts (6, 8, 10, 12, 15 s), three intervals (150, 200, 250 ms), two behaviours on
timeout (46 definitions return one more falsy predicate result, 5 return `null`), two on success
(the value, or `true`). Three suites (`bythebooks`, `riders`, `twoclient`) define none and three
special-purpose waits exist beside them (`arrived`, two `waitDamage`). `ok` has 4 variants in 43
suites, `want` 6 in 41, the settings snapshot 10 forms in 37, the dice rigging one form in 22.

**Inline loops.** 145 `for`/`while` loops with an awaited wait inside: 120 wait loops (63 distinct
texts in 40 suites), 20 retry loops (11 of them in `hold`), 5 paced iterations. None throws when
it runs out; all fall through. Three loops are copied text: the token-render wait (33 copies in 30
suites), the `canvas.ready` wait (22 copies in 22 suites), the scene-view wait (9 copies in 7).
83 of the 120 wait loops are 40 × 250 ms.

**Bare waits.** 1,001 `sleep(n)` call sites that neither poll nor precede a poll:

| n | sites |
| --- | ---: |
| ≤ 250 ms | 283 |
| 251 to 1,000 ms | 558 |
| 1,001 to 3,000 ms | 158 |
| over 3,000 ms | 2 |

They sum to 578 s counted once each, about a fifth of a 50-minute battery, and they are the
exact mechanism of "a faster platform turns a poll into a lie": a bare wait asserts nothing and
goes wrong in both directions. By suite: `classes` 265 sites / 136 s, `saves` 88 / 47 s,
`emanations` 86 / 65 s, `hold` 33 / 44 s (22 of them over a second), `metamagic` 39 / 12 s,
`monsters` 38 / 18 s, `spells` 38 / 17 s, `splat` 37 / 18 s, `reminders` 35 / 16 s.

One in-page prelude injected by the harness's connect (`sleep`, one poll with one timeout policy
that throws with the predicate's name, the token / canvas / scene waits, `ok`, `want`, the
settings snapshot, the dice rigging) replaces the 65 + 51 + 64 definitions. The 1,001 bare waits
are the call sites where that poll goes in, suite by suite, starting with `classes`, `emanations`
and `hold`.
