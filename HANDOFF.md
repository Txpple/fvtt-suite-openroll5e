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
| fvtt-mod-bythebooks | review rows 1–2: every decision clock names its owner (`armAskTimer` takes `owns`; the sixteen hand-written clocks and the hold's moved onto it; the offer's buzzer on `armDeadline`; `check-clocks` in verify); every read-modify-write through the serializer (ten sites; `check-serializer` in verify; the metamagic window recorded; D9 parked in the tool as in the prose) | `164485b`, `1f87944` | yes (no release; decision 1) |
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

**Owed.** Nothing from the MCP: its three re-pointed verify scripts ran green on the sandbox on 2026-10-15 (4i). The
suite README's revert sentence was corrected the same evening (`a5fe159`; decision 2).

**Every decision in §3 is made** (the user, 2026-10-15). The work runs from §6, *The autonomous
run*.

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
| **0. The release carries its proof** | a By the Books tag body names the battery run (`Battery: <run> — n/n suites, n/n checks, GREEN`) or says `Battery: none (pre-release)`; the build refuses a tag with neither; a pre-release never reaches prod through `register-module`; `battery-status.mjs --line` prints the line to paste. Then the battery made cheaper: `smoke-classes` split by class, the 1,001 bare waits replaced by one injected poll, the count pins retired, a static gate for `tools/` | release half landed on By the Books `main` 2026-10-15 (`d2ddbe7..b4dfd6f`: `tools/battery-line.mjs`, `--line`, the builder's rule, `release.yml`'s pre-release path, NOTES §5); the battery half landed the same day (`handoff/4b`, in `da962af`): one injected prelude (`tools/prelude.mjs`), bare waits 1,232 to 10 across 59 of 61 suites (`smoke-d20-folds` and `smoke-metamagic` stand at 27 and 40, pinned), `smoke-classes` split into 13 class suites on `tools/class-kit.mjs`, three count pins retired, `check-harness` in verify; the full battery 41.4 min (was 50.6): `Battery: 2026-10-15T19-02-55 — 67/67 suites, 2250/2250 checks, GREEN`; the under-40 target not reached (`smoke-saves` waits out the Decision Timer in real time) | the next three releases name their run; a full battery is under 40 minutes |
| **1. The presentation pass** (the hub) | the review's §5 helper table, rows 1–10, in order: the clock's owner ✅, the serializer ✅, the pending card row, `closePopup`, owner-exported flag readers with a flag-edge check, `postCard` with the whisper policy and the relay's sending side, one pick builder with `check-pickers` over every machine, `tokenDocOf`, `resolveUuid` everywhere, the logger; raw `DialogV2` allowed only in `ui.js` once `openMomentPopup` fires on dismiss and carries a buzzer | rows 1–4 landed on `main` 2026-10-15 (rows 3–4: `05a2bad`, `90ef506`, merged `dbd5f48`, the full battery green 55/55, 2,250 checks); rows 5–7 landed the same day (`e63443a` the gate fix, `16a277f`, `c574d85`, `975fafe`, merged `da962af`; the combined battery with 4b green, 66/66 rows, 2,250 checks); rows 8–10 and the raw `DialogV2` rule landed the same day (`handoff/4k`, merged `95efcb4`: `resolveUuid` in `core.js` with raw lookups 122 to 0, `tokenDocOf` in `geometry.js` with 55 to 1 pinned, the logger with console calls 616 to 2 and Biome's `noConsole` an error, `openMomentPopup` with `onDismiss` and a buzzer and `confirmPopup` so no raw `DialogV2` stands outside `ui.js`; `check-lookups` in verify; the full battery green, `2026-10-15T22-24-03`, 67/67, 2,266 checks, after it caught two bugs in the token rule, both fixed) | the §5 counts read one file each; `npm run verify` fails on a new bypass |
| **2. Several GM clients** (suite #8) | the multi-GM harness mode and the connect-race measurement first; then the landing claim stamped with its user and re-driven when that user is gone; then the `isGM` audit, each site tagged presentation or consequence, and each consequence checked against what an Assistant GM may write (the review's §5 has the hub's list; §6 Loot Shelf's); the family half is Pass 4's `elect.js` | measured 2026-10-15 (`e7b7a8b` on By the Books `main`: the harness mode `GM_CLIENTS`, `probe-multi-gm.mjs`, `seed-gm-identities.mjs`, the note `audits/plans/multi-gm-measurement.md`; 56 cycles, 0 ms overlap, a 1.1 s gap, one landing per record; the one path is the stale snapshot, about 10 ms wide); the rest landed the same day (`handoff/4j`, merged `2eb5b63`): the snapshot guard, the `isGM` audit (24 reads tagged, none a consequence; `check-gm-sites`), the claim stamped `{ by, window, at }` at 13 sites with the liveness rule and the re-drive, `smoke-companions` §9 and `smoke-summons` §10 with two GM clients; the full battery green (`2026-10-15T20-40-45`, 67/67, 2,264 checks); left: the Gamemaster-beside-Assistant runs (the `gm2` user, §7), the other claims still `true`, the auras re-raised on an elect hand-off (the emanations machine's own pass) | `smoke-companions` and `smoke-summons` each assert one landing per record with two GM clients, and again with a Gamemaster beside an Assistant GM |
| **3. Contracts across repos** | the emitter owns `contracts/<name>.json` (schema, version, payloads its battery recorded): By the Books publishes the moment payload and the card-flag keys; FX Studio and Session Scribe test against them from the sibling clone, skipping when absent; the MCP's Area Sounds mirror tested against `engine.js`; FX Studio de-duplicates on `momentId` plus `event` and reads `outcome`; the scribe reads the 26 keys it misses; the three writers on Dead become one rule; a suite `contracts --check` | in progress (4f) | a renamed field in the hub fails a sibling's test before it ships |
| **4. The family kit** (vendored, never shared) | five byte-identical files copied into each module and checked by a suite tool like `suite-sections.mjs`: `elect.js`, `wrap.js`, `receipt.js`, `log.js`, `settings.js`; a module template (Biome, Vitest, `verify.yml`, a generalized `release.yml`) and one reusable workflow in the suite so the hand-built zips and the two PowerShell release scripts retire; `upstream-surface.mjs` gains a `patched` set; Loot Shelf and Party Stash share one receipt and post one line per sale | the kit's three files (`elect.js`, `receipt.js`, `log.js`) landed 2026-10-15 in Loot Shelf (`802e80a..587c14f`) and Party Stash (`2ed9810..43a27e6`) with Biome and Vitest, one receipt line per move and the GM's one-click revert on the elect, live checks green on the sandbox; the suite's `templates/kit/` is the source and `tools/kit-sync.mjs` keeps the copies (`repos.json` `kit`); `templates/module/` and the reusable `release-module.yml` with `tools/build-module-zip.mjs`; Loot Shelf, Party Stash, Autoexplore and Open Server release from a tag through it (dry runs dispatched 2026-10-15); `upstream-surface` carries `patched` (24 methods, 7 repos) and the watch reads it; `wrap.js` and `settings.js` left out per decision 4 (§7); the releases that make the revert promise true wait for the user; Token Art is the first candidate for the template | every module releases from a tag; the watch's next review issue lists a patched name |
| **5. The docs recut** | CLAUDE.md carries rules, dated history moves to a log per repo; the State block on every sibling with a CLAUDE.md; the public claims corrected or built (§9 of the review); one suite check: no date in a CLAUDE.md outside its State block | not started; the suite CLAUDE.md grew again today (Token Art) | the suite file under a third of its size |
| **6. The MCP** | the companion's steps 1–3 ✅; step 4 measure the other clients once; step 5 `$defs` left alone; step 6 design.md names the 4.x line; then the correctness edges in order: failures as `isError` (the assets family, the PC rollback, `rolled-back` thrown), a `noReceipt` tag with a "not undoable" line, the ambiguity refusal on fuzzy writes (#19), `run-script-api.mjs --check` in `npm test`, `scratch/` excluded from vitest, the `MOLTEN_` leak back inside `src/hosts` | steps 1–3 and 6 landed, and every correctness edge, on MCP `main` 2026-10-15 (`959389f..37a185a`: design.md names the 4.x line and its gate, `scratch/` excluded, `run-script-api --check` in `npm test`, `MOLTEN_` back inside `src/hosts`, misses and refusals as coded errors, the `NO_RECEIPT` tag and the "not undoable" line, the fuzzy-write tie refusal and #19 fixed and closed); the three owed live scripts ran green on the sandbox, plus `verify-asset-plane` and `verify-ownership-inherit`; left: step 4, measuring what Claude Desktop loads (§7) | the README's receipt sentence is true; design.md names 4.x |

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
3. ~~**design.md's framing of the MCP**~~ **Decided 2026-10-15:** the feature line is open, with a
   gate: a feature lands when it serves onboarding or the table, and is written into design.md
   before it is built; no live in-session assistant stays. design.md §1 and §9 and CONTRIBUTING's
   opening say so in Pass 6 step 6.
4. ~~**The kit's scope**~~ **Decided 2026-10-15:** small, pulled by need. Three files first
   (`elect.js`, `receipt.js`, `log.js`); `wrap.js` and `settings.js` when a second module needs
   them. Loot Shelf and Party Stash adopt first and gain the one-click revert with the receipt
   move (the promise the README dropped today comes back true). Autoexplore and Open Server take
   only the release workflow.
5. ~~**The docs recut's cut line**~~ **Decided 2026-10-15:** a CLAUDE.md keeps its rules and one
   State block; the dated journal moves to `docs/log/YYYY-MM.md` in each repo; release detail goes
   to the CHANGELOG or the GitHub release notes; the suite check forbids a date outside the State
   block.
6. ~~**i18n**~~ **Decided 2026-10-15:** no plans for non-English. Hooks for later are fine: the
   module template ships a `lang/en.json` and a small module moves its strings when it adopts the
   template; nothing is scheduled, By the Books not at all.
7. ~~**Two GM clients**~~ **Decided 2026-10-15:** Pass 2's measurement (4e) runs now, beside Pass 1
   (different files); the rest of Pass 2 is ordered from what it finds. The goal, in the user's
   words: "ultimately, we need to support multiple gm clients, of varying or same privilege level
   (full vs assistant)". So Pass 2 covers any number of GM-capable clients, Gamemaster and
   Assistant GM alike, not just the pair.

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

**4e. Pass 2, the measurement** (By the Books `tools/`, then `core.js`; runs now, beside Pass 1): a
multi-GM harness mode (extra GM identities in `target.mjs`, one a Gamemaster and one an Assistant
GM, the preflight allowing exactly the named set); a note of which consequence writes an Assistant
GM is refused (Foundry's permission table) and whether the elect can land on one; a probe that fires a
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

## 6. The autonomous run

For the session that runs the plan from here without the user at the keyboard. It needs no context
beyond this file, the review, `CLAUDE.md` and the memory index; §3 holds every decision, made.

**The shape.** This session is the orchestrator: it starts one session per brief (§4), fresh
context, Opus 5.5, **each in its own worktree** (several briefs touch By the Books and parallel
sessions in one checkout collide on commits), keeps the waves below, merges each finished branch
to `main`, deletes the branch locally and on GitHub, and ticks the pass in §2 here. It does no
pass's code itself. It checks a session's diff and gate output before calling a brief done.

**The waves.** A wave's briefs run in parallel; a brief waits for the one it names.

| Wave | Briefs | Waits for | Sandbox |
| --- | --- | --- | --- |
| 1 | **4a** Pass 0 tooling (By the Books `tools/build-release.mjs`, `battery-status.mjs`, `release.yml`, NOTES) | — | no |
| 1 | **4c** rows 3–4 (`scripts/ui.js` and the machines) | — | `battery.mjs --changed` at the end |
| 1 | **4e** the multi-GM measurement (`tools/target.mjs`, the preflight, a probe), with decision 7's Assistant GM | — | yes, the probe |
| 1 | **4i** the MCP's remaining steps, design.md and CONTRIBUTING per decision 3, plus the owed live run of `verify-placeables-tooling`, `verify-receipts`, `verify-delete-veto` | — | yes, the three scripts |
| 2 | **4b** the harness prelude and the bare waits, `smoke-classes` split | 4a | full battery |
| 2 | **4d** rows 5–7 | 4c | `--changed` |
| 2 | Pass 2's rest (the claim with its user, the re-drive, the `isGM` audit), ordered from 4e's findings | 4e | yes |
| 3 | **4f** the contracts | 4d (the flag readers settle the keys) | the recording run |
| 3 | **4g** the kit, decision 4's scope: Loot Shelf and Party Stash first, with the one-click revert | 4e (the elect learns the Assistant GM) | the modules' live checks |
| 4 | **4h** the docs recut, decision 5's cut line, i18n's template hook per decision 6 | every other brief (each one writes to CLAUDE.md) | no |

Rows 8–10 of Pass 1 (`tokenDocOf`, `resolveUuid`, the logger) and the raw `DialogV2` rule follow
4d in wave 3 as their own brief, written from the review's §5 in the same form as §4.

**The sandbox takes one at a time.** Before a session's battery, probe, `local-foundry.mjs
restart` or long bridge walk, the orchestrator holds every other sandbox user; a session asks it
for the seat and releases it when done. A GM seat that blocks is a bridge (`disconnect-bridge`),
never a person.

**What the run may do without asking.** Commit and push to `main` in any family repo once
`npm run verify` (or the repo's own gate) is green on its real exit code and the brief's battery is
green; open, comment on and close the family's GitHub issues for the work; regenerate the suite's
generated files (`suite-sections`, `integration-map`, `upstream-surface`) and commit them; edit
public README words to what decisions 2–6 already say.

**What waits for the user.** Every release and tag (patch bumps by default when the user asks);
anything on prod: `foundry-halruaa5e`, `.env.halruaa`, `register-module.mjs` or
`deploy-house-module.mjs` without `--local`; a game-rules ruling (By the Books' RULINGS); a red
battery the session cannot explain after one re-run; a change outside the decisions in §3. The run
writes these into §7 below and carries on with the work that does not depend on them.

**Done.** Every brief's "done when" met, §2 ticked, §7 holding only what waits for the user, a
one-paragraph summary at its top. Then this file is retired per its header.

## 7. Waiting for the user

The autonomous run started 2026-10-15 after GO (an orchestrator with one Opus agent per brief, each in a
worktree beside its clone, `<repo>.<brief>` on branch `handoff/<brief>`; the MCP's
`deploy-house-module.mjs --from <dir>` proves a worktree on the sandbox). What it could not do:

1. **A Gamemaster test user on the sandbox** (4e). The suite identity is an Assistant GM (role 3), and
   Foundry lets a user create only users of its own role or below, so the second Gamemaster the
   mixed-role orderings of `tools/probe-multi-gm.mjs` need can only be made from your own Gamemaster
   window on the sandbox: Configure Players → Create User, name `Gamemaster Tester`, role Gamemaster,
   the password on the `FOUNDRY_GM2_PASSWORD` line the run appends to the MCP's `.env`. Then
   `node tools/probe-multi-gm.mjs --orderings full-assistant,assistant-full` (about 10 minutes) fills
   the note's mixed-role rows. The same-role orderings run without it.
2. **Two presentation choices from 4c, each a one-line revert if you prefer the old look:** five card
   bars that were drawn but never synced now drain (Commander's Strike, the bystander's held roll,
   Tactical Mind's armed check, the sweep, Bait and Switch); and `area-ask.js` reopens its popup on
   every render rather than once, kept as it was.
3. **A wording in By the Books' release chain** (4a, `tools/README.md` step 5): an annotated tag the
   builder refuses and that has not been pushed yet is rewritten in place (`git tag -a -f`); a pushed
   tag still never moves. Say if you would rather it always be a new tag.
4. **Measure what Claude Desktop loads** (the MCP companion's step 4; needs your own client). Register the
   server in Claude Desktop with the `mcpServers` block `npm run init` prints, open a chat, note whether the
   schemas load eagerly or deferred and whether a union's `anyOf` is shown or merged, then add one note to
   the MCP's `docs/contracts.md`. Until then the eager ceiling stands for the clients not measured.
5. **Two readings 4d took, yours to overturn** (By the Books, rows 5–7): the review said "owner-exported
   readers", and for the machine-owned keys a service or the spine reads (`hold`, `saves`, `d20fold`,
   `metamagic`, `fightingStyle`, `attackFor`, `attackHoldPending`) a reader inside the machine would be an
   import `check-layers` forbids, so those readers sit in `shared.js` ("shared readers go down, never
   sideways", ARCHITECTURE §7) and `sourceUuid`'s in `core.js`; the rest sit with their writers. And the
   eleven hand-written pick inputs moved onto the one input builder but kept their own labels and layouts;
   putting every pick on `tickRowsHTML`'s one row look is a visible change left to you.
6. **Loot Shelf and Party Stash releases** (patch bumps, on your word) carry the kit and the one-click
   revert; with them the suite README's sentence (lines 34–35) becomes: "**Everything it does, you can
   see.** Every automatic action in combat, every trade at a shelf and every transfer through the stash
   posts a receipt with a one-click revert." A third receipt mode, "Receipts to the DMs only", joins the
   two in both settings sheets. Left out of the kit by decision 4's "pulled by need": `wrap.js`, although
   the shared seams are real (`Token#_canView` in Loot Shelf and Combat Plus, `BaseActorSheet#_defaultDropBehavior`
   in Loot Shelf and Party Stash), because converting the 13 patch sites needs the drop suites run live and
   reaches into Combat Plus; and `settings.js`, since the receipt-mode radios are still drawn in each module.
   The release workflows' dry runs (`workflow_dispatch`, nothing published) were dispatched for the four
   modules; their results are on each repo's Actions page.
7. **A design choice from Pass 2's re-drive (4j), yours to overturn.** A landing claim is now stamped
   `{ by, window, at }`, and a claim whose user left (or older than 60 s with nothing landed) is re-driven
   by the elect. A re-driven landing repeats what its dead claimant wrote before it went, except a summon's
   (its tokens, resistance and effects carry their card and are removed first) and the writes judged at the
   landing (a mastery or known-form list, Temporary Hit Points that keep the larger pool): a rest grant's
   pool use, an initiative swap or a held share's damage could land twice if the claimant dies in the
   milliseconds between its first world write and its record. The alternative is the record stuck claimed
   forever with nothing landed (the behaviour before). ARCHITECTURE's accepted trade-offs record it; the
   other claims (`dismissing`, `companion.acting`, `changing`, `resolving`) still use plain `true` and are
   a follow-up in the same shape.
8. **Dead: two writers contradict each other (4f; a ruling).** With Combat Plus's defaults (both Auto-Defeated
   switches on) and dnd5e's *Apply Downed Conditions* at *npcs* or *all*, a player character at 0 Hit Points
   wears dnd5e's (or By the Books') Unconscious and Combat Plus's Dead at once, and an important NPC the same;
   By the Books reads Dead on a caster as the caster's death, so a dying caster's summons that end at its death
   are dismissed and its empowered companion reverts. Nothing was changed; `contracts/dead.md` lays out the
   choices: Combat Plus defers to dnd5e when its setting is on (marks defeated, writes no status), or reads
   dnd5e's mapping (`important`, the death saves), or its PCs switch defaults to off; and whether Token Art's
   dead look follows the Dead status alone rather than 0 Hit Points. Until then: dnd5e at *all* with
   Combat Plus's *Auto-Defeated: PCs* off is the book.
9. **FX Studio plays differently once released** (4f, inside Pass 3): a resolve that came to nothing (a held
   roll passed, a fold passed, a Riposte declined) plays nothing, and Parry's maneuver now plays (one picture
   per word, not per moment). FX Studio, Session Scribe, the MCP and Area Sounds all carry unreleased work on
   `main`; the releases are yours (patch bumps).
10. **Small readings from Pass 1's rows 8–10 (4k), yours to overturn:** the one token rule finds the same
    token as before wherever an actor stands once on the viewed scene; where a world actor stands twice, the
    token this client controls comes first, and a synthetic actor's own token is found on any scene (the
    rule takes a world actor's linked tokens only, as the old lookups did; the battery caught and fixed a
    wider first version). The party view now fronts its open window on a second click instead of stacking
    another; the two Yes/No confirms join the popup staircase and no longer take Enter; effect-view's
    console lines open with the module's title instead of the package id; one debug line prints only
    behind the new `CONFIG.debug.bythebooks` switch; a uuid the platform throws on reads as "not here".
    Left for a later pass (the review's row 10 note): twelve world writes still swallowed by an empty
    `.catch(() => {})`, and four separate warn-once sets.
