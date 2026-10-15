# HANDOFF.md — the pick-up point after the suite review of 2026-10-15

> **What this is.** The one document a cold session reads to continue the work the review started.
> It holds the state as of the evening of 2026-10-15, the complete plan with every pass's status,
> the decisions only the user can make, and a brief per piece of work ready to hand to a session.
> It is retired when the passes below are delivered or the user replaces the plan. Dated history
> stays out of it: the review itself is `docs/reviews/2026-10-15-suite-review.md`, its companion
> `docs/reviews/2026-10-15-mcp-tool-surface.md`, and the family's rules are `CLAUDE.md`.

## 1. Where things stand

**Landed today, all gate-green.**

| Repo | What | Commits | Pushed |
| --- | --- | --- | --- |
| fvtt-suite-openroll5e | the review and its MCP companion; CLAUDE.md's pointer to `docs/reviews/` | `a4563da` | yes |
| fvtt-mcp-dnd5e | issue #18: three context budgets with named payers; `manage-placeables` entries on per-kind keys; one leaf per shared key (lossy keys 0) | `0bbe4ff`, `1a7bea5`, `5200c0e` | yes; #18 closed |
| fvtt-mod-bythebooks | review rows 1–2: every decision clock names its owner (`armAskTimer` takes `owns`; the sixteen hand-written clocks and the hold's moved onto it; the offer's buzzer on `armDeadline`; `check-clocks` in verify); every read-modify-write through the serializer (ten sites; `check-serializer` in verify; the metamagic window recorded; D9 parked in the tool as in the prose) | `164485b`, `1f87944` | **no** (main is 2 ahead) |
| fvtt-mod-tokenart | a new module, built, walked and released 1.0.0 by another session the same day, on prod and the sandbox | `v1.0.0` | yes |

Proof: By the Books `npm run verify` green (1,534 tests); the full battery green on the sandbox
(`dist/battery/2026-10-15T13-55-32`: 45 suites, 1,691 checks; an earlier run was cut short by a
foreign bridge, and its two reds passed alone). The MCP's `npm test` prints the three budgets:
per prompt 13,916 of 14,000; largest flattened tool 36,758 of 36,800 (`manage-placeables`, all
eight kinds now visible); the eager list 205,873 of 220,000 with a per-toolset table. Nothing is
released from By the Books for rows 1–2 and nothing is on prod from them.

**What the MCP's #18 work left** (that session's own notes): the per-toolset rows are pinned at
today's numbers (actors 74,911 of 75,000; scenes 62,394 of 62,500; the rest within 100 of their
ceilings), so the next field in a family raises that family's row in its commit, by design. The
placeables keys were re-pointed in four skills (`tom-cartos-import`, `token-cutout`,
`plot-drift-check`, `_shared/authoring-policy`; skills-matrix 0 unresolved) and three verify
scripts (`verify-placeables-tooling` §G, `verify-receipts`, `verify-delete-veto`); **none ran live:
one sandbox run of those three is owed before the next MCP release.** Three contracts tightened in
the same commit: `search-compendium` `limit` is 1–500 for every type (was 50 for "any");
`manage-rolltables update` refuses an empty formula or results; `manage-journals` refuses an empty
name on update and an empty `pageId` on get or update. The page functions (`fvtt.createSceneTiles`
and the rest, reachable from `run-script`) keep `items`/`patches`/`ids` by design; no sibling or
campaign repo names the old keys. CHANGELOG's Unreleased entry carries the numbers.

**Open on the user's word.** Push By the Books main; cut 3.4.8 for rows 1–2 or fold them into the
next release (if cut, name the battery run in the tag body: the first release under Pass 0's rule).
The MCP's three re-pointed verify scripts on the sandbox before its next release.

**Proposed, not started** (cards in the review session; each brief is in §4 below): Pass 0's
release rule; the harness prelude and the bare waits; review rows 3–4.

**What rows 1–2 left on purpose** (the hub session's own notes): the ten clocks that were already
on `armAskTimer` stay on the elect (mastery, concentration, the saves' demand have a §3 driver row
naming the subject, so with no GM those clocks never start); ARCHITECTURE §3 *The clocks* records
it as the standing choice and a card proposes the ruling plus a `smoke-nogm` section.
`stored-dice` and `volleys` stay on raw `armDeadline`, pinned in `check-clocks` with reasons. Of
about 31 raw read-modify-writes on chat flags, 10 were routed through the serializer and 21
one-writer ones stand pinned by file, function and flag in `check-serializer`'s ALLOW; the check
sees same-file callers only when a parameter is spread into a write, so it fails until pinned.
`hold` §7 and `saves` §10d failed once in the interrupted run and passed alone; neither suite was
re-run in full after that. NOTES has no line yet on a stale CONNECTED suite seat after a Foundry
restart (it does not block; the preflight counts other users only).

**The sandbox** (`foundry-local5e`, the user's local Foundry 14.369 / dnd5e 6.0.6): runs the same
bytes as the releases plus By the Books `main` at `1f87944` as a dev copy (`deploy-house-module.mjs
--local`, byte-identical), Token Art 1.0.0 enabled, the battery's fixtures torn down (run 2's
teardown exited 0, not re-checked by hand), the Going Down house rule restored to on, nine Token
Art walk PNGs under `assets/tokenart-walk/`; the Token Art session's two "Token Art Walk" scenes
(A active) were offered a cleanup and may or may not be gone. The hub session's bridge is
disconnected; the Token Art session's may be back. It takes one GM-capable seat at a time and is
shared between sessions: check the linked sessions before a restart, a `register-module.mjs` run
or a bridge walk (CLAUDE.md, *Testing host*).

**Prod** (Echoes of Halruaa on Molten): By the Books 3.4.7, FX Studio 0.10.2, Errata 1.2.2,
Combat Plus 1.7.0, Token Art 1.0.0, the rest at the versions in `docs/integration-map.md`. Nothing
from today's By the Books commits is on it.

## 2. The complete plan

The review's §8, with today's progress folded in. Each pass names what done looks like and the
check that keeps it done. Order is by risk and cost; passes on different files can run in
parallel, but every By the Books pass ends with a battery and the sandbox takes one at a time.

| Pass | What | Status | Done when |
| --- | --- | --- | --- |
| **0. The release carries its proof** | a By the Books tag body names the battery run (`Battery: <run> — n/n suites, n/n checks, GREEN`) or says `Battery: none (pre-release)`; the build refuses a tag with neither; a pre-release never reaches prod through `register-module`; `battery-status.mjs --line` prints the line to paste. Then the battery made cheaper: `smoke-classes` split by class, the 1,001 bare waits replaced by one injected poll, the count pins retired, a static gate for `tools/` | proposed (two cards) | the next three releases name their run; a full battery is under 40 minutes |
| **1. The presentation pass** (the hub) | the review's §5 helper table, rows 1–10, in order: the clock's owner ✅, the serializer ✅, the pending card row, `closePopup`, owner-exported flag readers with a flag-edge check, `postCard` with the whisper policy and the relay's sending side, one pick builder with `check-pickers` over every machine, `tokenDocOf`, `resolveUuid` everywhere, the logger; raw `DialogV2` allowed only in `ui.js` once `openMomentPopup` fires on dismiss and carries a buzzer | rows 1–2 landed; rows 3–4 proposed | the §5 counts read one file each; `npm run verify` fails on a new bypass |
| **2. Two GM clients** (suite #8) | the two-GM harness mode and the connect-race measurement first; then the landing claim stamped with its user and re-driven when that user is gone; then the `isGM` audit, each site tagged presentation or consequence (the review's §5 has the hub's list; §6 Loot Shelf's); the family half is Pass 4's `elect.js` | not started; the measurement decides the rest | `smoke-companions` and `smoke-summons` each assert one landing per record with two GM clients |
| **3. Contracts across repos** | the emitter owns `contracts/<name>.json` (schema, version, payloads its battery recorded): By the Books publishes the moment payload and the card-flag keys; FX Studio and Session Scribe test against them from the sibling clone, skipping when absent; the MCP's Area Sounds mirror tested against `engine.js`; FX Studio de-duplicates on `momentId` plus `event` and reads `outcome`; the scribe reads the 26 keys it misses; the three writers on Dead become one rule; a suite `contracts --check` | not started | a renamed field in the hub fails a sibling's test before it ships |
| **4. The family kit** (vendored, never shared) | five byte-identical files copied into each module and checked by a suite tool like `suite-sections.mjs`: `elect.js`, `wrap.js`, `receipt.js`, `log.js`, `settings.js`; a module template (Biome, Vitest, `verify.yml`, a generalized `release.yml`) and one reusable workflow in the suite so the hand-built zips and the two PowerShell release scripts retire; `upstream-surface.mjs` gains a `patched` set; Loot Shelf and Party Stash share one receipt and post one line per sale | not started; Token Art (built today from the plan in `docs/plans/tokenart.md`) is the first module that could start from the template | every module releases from a tag; the watch's next review issue lists a patched name |
| **5. The docs recut** | CLAUDE.md carries rules, dated history moves to a log per repo; the State block on every sibling with a CLAUDE.md; the public claims corrected or built (§9 of the review); one suite check: no date in a CLAUDE.md outside its State block | not started; the suite CLAUDE.md grew again today (Token Art) | the suite file under a third of its size |
| **6. The MCP** | the companion's steps 1–3 ✅; step 4 measure the other clients once; step 5 `$defs` left alone; step 6 design.md names the 4.x line; then the correctness edges in order: failures as `isError` (the assets family, the PC rollback, `rolled-back` thrown), a `noReceipt` tag with a "not undoable" line, the ambiguity refusal on fuzzy writes (#19), `run-script-api.mjs --check` in `npm test`, `scratch/` excluded from vitest, the `MOLTEN_` leak back inside `src/hosts` | steps 1–3 landed | the README's receipt sentence is true; design.md names 4.x |

**One trade made today, to be aware of.** Per-kind keys made `manage-placeables` lossless in Claude
Code, and the flattened tool grew from 13k chars (one kind visible) to 36.8k (all eight visible),
about 10k tokens per fetch. The eight-tool split would make each fetch 3.8–10.4k at the cost of
185 name chars per registration and 3,415 on the eager list. The budget pins 36,800 so it cannot
grow further; whether to split is a decision for when a session is felt to pay for it.

## 3. Decisions only the user can make

1. ~~**Push By the Books and whether 3.4.8 is cut**~~ **Decided 2026-10-15:** pushed; no 3.4.8.
   Rows 1–2 go out with the next release, the first to name its battery run (Pass 0).
2. ~~**The public promises**~~ (review §9). **Decided 2026-10-15:** the suite README's sentence now
   promises the revert for combat only (shelf and stash: a receipt); the shelf/stash revert waits for
   Pass 4's `receipt.js`; the MCP README's "every write tool answers with a receipt" is fixed with
   Pass 6's no-receipt tag and "not undoable" line. "Loot Shelf knows Party Stash" in the suite
   CLAUDE.md stays for Pass 5.
3. **design.md's framing of the MCP**: "in maintenance since 3.0.0" against a 4.x feature line.
   Pass 6 step 6 needs the sentence.
4. **The kit's scope** (Pass 4): how much vendored code the small modules carry, and whether Loot
   Shelf gains the revert the README promises while its receipt moves onto the kit.
5. **The docs recut's cut line** (Pass 5): what leaves CLAUDE.md for a log, and where the log lives.
6. **i18n**: nine public modules, zero `lang/` folders. Not scheduled; cheapest now.
7. **Two GM clients**: whether the co-DM case is wanted soon enough to pull Pass 2 ahead of Pass 1.

## 4. The briefs, ready to hand to a session

Every session: Opus 5.5 for delegated work; `npm run verify` on its real exit code, never piped;
one GM seat on the sandbox (an MCP bridge is a seat; `disconnect-bridge` first; the preflight
refuses a second and names it); comments in `scripts/` and `tools/` carry no dates, quotes or
history; releases are patch bumps by default and only on the user's word; no prod deploy is owed
with a release; parallel sessions share the working tree (`git status` before trusting
"uncommitted"). Each brief names its repo, its files and what done looks like.

**4a. Pass 0, the release names its battery** (By the Books; `tools/build-release.mjs`,
`.github/workflows/release.yml`, `tools/battery-status.mjs`, `NOTES.md` §5 *Release*, a vitest for
the parser). With `--tag`, the annotated tag's body must contain `Battery: <dist/battery run id> — …
GREEN` or `Battery: none (pre-release)`; the second publishes with `--prerelease`; neither fails
the build quoting both forms; `battery-status.mjs --line` prints the line for the newest run.
Done: verify green, the dry run still builds the zip, the rule in NOTES.

**4b. The harness prelude and the bare waits** (By the Books `tools/`). `harness.mjs` injects one
in-page object before any suite body: `sleep`, one `until(test, { timeout, every, label })` that
throws with the label on timeout, the token/canvas/scene waits, `ok`, `want`, the settings snapshot,
the dice rigging. Suite by suite (`classes`, `emanations`, `hold`, then the rest) delete the local
copies and turn each bare `sleep(n)` that waits for something observable into `until`; a bare sleep
stays only for a module clock, with a comment. Split `smoke-classes.mjs` by class with `DEPENDS`,
update `coverage-map.mjs` and its check. A `check-harness.mjs` in verify: no suite defines its own
helpers; bare sleeps per suite against a ceiling that only goes down. Done: verify green, the full
battery green, the per-suite minutes before and after in the commit messages (Appendix B's
timestamp method). The measured starting point is the review's Appendix D.

**4c. Review rows 3–4, the pending row and closePopup** (By the Books `scripts/ui.js` and the
machines). `pendingRow(message, html, { bar, latch, answer, arm })` replaces the 27 copies (31
latches, 26 Answer buttons), arming through the row-1 `armAskTimer` with the machine's owner;
`closePopup(message, sub)` that awaits and catches replaces the 15 `void open.close()` copies; the
40 `livePopups.get` reads outside `ui.js` move onto an exported predicate where they only ask "is
it open". A static check beside `check-pickers.mjs`: no machine draws a latch, an Answer button or
a popup close of its own. Done: verify green, `battery.mjs --changed` green, one commit per row with
before/after site counts.

**4d. Review rows 5–7** (after 4c, same repo): owner-exported readers for the twelve keys with
three or more outside readers (Appendix C: `receipt`, `saves`, `hold`, `attackFor`,
`attackHoldPending`, the chip kind, `sourceUuid`, `effectReceipt`, `metamagic`, `metamagicAsk`,
`d20fold`, `fightingStyle`; 95 of 159 outside sites) and a flag-edge check beside `check-layers`;
`postCard({ actor, token, card, flags, to })` with `gmIds()` / `ownersAndGmIds()` for the 114
`ChatMessage.create` sites and `postAnswer` for the relay's 20 senders; one pick builder
(`tickRowsHTML` + `picked(form, name)` + `choicePopup`) for the three copied bystander popups and
the ten hand-written inputs, `check-pickers` over every machine. Also fix the gate: `check-moments`
misses a write through a variable (`spellDamage`, `migratedFrom`) and files `FORM_FLAG` under the
wrong name.

**4e. Pass 2, the measurement** (By the Books `tools/`, then `core.js`): a two-GM harness mode (a
second GM identity in `target.mjs`, the preflight allowing exactly the pair); a probe that fires a
landing as the second GM connects and counts what lands; then, if the race is real, the claim
stamped with the claimant's user id and a re-drive when that user is no longer active. Suite #8
has the full analysis and the proposed order.

**4f. Pass 3, the contracts** (By the Books first, then FX Studio, Session Scribe, the MCP): the
moment payload and the card-flag keys recorded by the battery into `contracts/`; consumers' tests
load them from `../fvtt-mod-bythebooks/contracts/` and skip when absent; FX Studio's `firstHearing`
keyed on `momentId` plus `event`, `outcome` read; the scribe's `BF_KEYS` grown to the 54 keys with
a "families skipped" line; `suite contracts --check`. The review's §6 has the file names.

**4g. Pass 4, the kit** (the suite's `tools/` plus each module): write the five files in one
module first (Loot Shelf is the one with the most to gain: the elect with `leadsWindow`, the
tagged wrap, the receipt with escaping and the echo marker), then the copy tool, then the template
and the reusable workflow; Token Art, built today without them, is the first candidate to adopt the
template. `upstream-surface.mjs` gains `patched`.

**4h. Pass 5, the docs recut** (the suite, then each sibling with a CLAUDE.md): the user's cut
line first (§3 item 5); the suite CLAUDE.md's "Reaching prod" and release history move to a dated
log; State blocks on Errata and imagegen; the public claims corrected; the no-dates check.

**4i. Pass 6, the MCP's remaining steps** (fvtt-mcp-dnd5e): design.md names the 4.x line (needs
§3 item 3); `scratch/` excluded in `vitest.config.ts`; `run-script-api.mjs --check` in `npm test`;
the `MOLTEN_` aliases back inside `src/hosts/env.ts`; failures as `isError`; the `noReceipt` tag;
the ambiguity refusal (#19); then one session measuring what Claude Desktop loads.

## 5. Pointers

- The review: `docs/reviews/2026-10-15-suite-review.md` (§4 the ranked issues, §5 the hub's helper
  table, §6 the family, §7 the MCP, §8 the passes, §9 the misses; Appendices A–D the bug classes,
  the battery's minutes, the flag-edge map, the harness's waits).
- The MCP companion: `docs/reviews/2026-10-15-mcp-tool-surface.md`.
- By the Books: `ARCHITECTURE.md` §3–§5, §7, §11; `tools/README.md`; the new `check-clocks.mjs` and
  `check-serializer.mjs` are the pattern for the next checks.
- The MCP: `CONTRIBUTING.md`, `design.md`, `src/measure.test.ts` (the three budgets and their
  comments), issue #18's closing comment.
- Suite issue #8 (two GM clients); MCP issues #19 and #20; By the Books #13, #1, #2.
- Token Art: `fvtt-mod-tokenart/CLAUDE.md` (its State block) and `docs/plans/tokenart.md`.
