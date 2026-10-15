# The dnd5e MCP's tool surface: what the ceiling measures, who pays it, and what to do about issue #18

Companion to [the suite review of the same day](2026-10-15-suite-review.md). Numbers measured 2026-10-15 on
`fvtt-mcp-dnd5e` at 4.6.0 (`npx vitest run src/measure.test.ts`, and a scratch measurement of the
flattened view described in §2; the scratch file is kept outside the repo, since the MCP's vitest
config picks up any `*.test.ts` under its gitignored `scratch/`, and its method is written out below
so it can be re-run).

## 1. The number and the wall

`src/measure.test.ts` ratchets four budgets. All four are close to their ceilings:

| budget | now | ceiling | headroom | what it is |
| --- | ---: | ---: | ---: | --- |
| tools/list | 204,987 | 205,000 | 13 | `JSON.stringify` of the advertised tool array, as the stdio transport sends it to a client that loads schemas eagerly |
| names ×2 | 6,143 | 7,000 | 857 | the 81 names in `mcp__<registration>__<name>` form, once per registration (prod and the sandbox) |
| skill descriptions | 7,773 | 8,000 | 227 | the front-matter `description` of the 17 skills |
| always-on (`session`) | 1,778 | 2,100 | 322 | the four tools every registration carries |

The ratchet did its job through the 3.0 line: 283,945 chars at 2.2.0 became 201,562 after M8, and the
ceiling was lowered to 205,000 so the gain could not leak back. Since then the surface has grown for
real reasons (4.x: lights read and written whole, `screenshot-scene asToken`, the receipts, the bridge
block) and the ceiling has become a wall: 4.6.0 had to shorten its neighbours' field descriptions to
fit, and those descriptions were already the product of the M7 diet. Trimming prose that was cut once
to make room for new prose trades description quality for a number. That is the issue's premise and it
is right.

## 2. Who actually pays the 205k

The ceiling measures the cost to a client that loads every schema at connect. That is the right number
for an eager client, and it is not the number the owner's daily client pays.

**Claude Code defers.** In this session the two Foundry registrations appeared as 162 bare tool names
in the prompt, with the line "their schemas are NOT loaded"; a schema enters the context only when the
model asks for it, one tool at a time. So per prompt Claude Code pays the names and the skill
descriptions, about 13.9k chars ≈ 3.9k tokens, not 57k tokens. The 205k is paid by other clients.

**And it flattens.** When a union tool's schema is fetched, Claude Code does not show the server's
`anyOf` members. It merges them into one object: the root properties, then each member's properties
with the first member winning a key, `additionalProperties: true`, and a one-line "input constraint"
listing the required-key combinations. Observed on `manage-placeables` in this session: the `items`
leaf was described as "The tiles to place" and carried only the tile fields; the light, wall, token
and region shapes under the same key were not shown at all.

The scratch measurement reproduces that merge offline and compares it to the advertised schema:

| tool | advertised chars | anyOf members | flattened (what Claude Code shows) | keys whose shape the merge loses |
| --- | ---: | ---: | ---: | --- |
| manage-placeables | 48,610 | 35 | 13,164 | `items` (8 shapes), `patches` (7), `ids` (9), `name` (2) |
| manage-actors | 14,517 | 6 | 12,568 | none |
| manage-scenes | 10,323 | 4 | 7,761 | `name` (2) |
| manage-rolltables | 5,578 | 6 | 2,932 | `name`, `formula`, `replacement`, `displayRoll`, `results` (2 each) |
| manage-items | 4,613 | 6 | 3,281 | none |
| search-compendium | 4,447 | 4 | 3,233 | `limit` (3 shapes) |
| manage-journals | 3,665 | 6 | 2,200 | `name` (2), `pageId` (3) |
| manage-folders | 2,441 | 4 | 1,158 | `name`, `parentFolder` (2 each) |
| manage-playlists | 2,102 | 4 | 1,189 | `name` (2) |
| manage-cards | 2,007 | 4 | 1,214 | `name` (2) |
| manage-macros | 2,056 | 3 | 1,458 | none |

Sum of the flattened views over all 81 tools: 154,634 chars (advertised 204,987). The member
descriptions (8,743 chars) are inside the `anyOf` and are dropped by the merge, so the owner's client
never sees them.

Two conclusions follow:

1. **The eager-list ceiling protects a client the owner does not use day to day.** It still matters:
   the sharing pass (4.4.0) says anyone can clone the server, and an eager client with both
   registrations would load about 114k tokens before the first word. But it is a different budget from
   the one the owner feels, and the two should be stated separately.
2. **The M8 union design optimised the eager number and made the deferred view lossy.** In Claude
   Code, `manage-placeables` with `kind: "lights"` shows the tiles' `items` fields. The model either
   guesses light field names or relies on the skills to carry them, which is why the skills carry them.
   This is a correctness exposure the current measure cannot see, and it is the one change in this
   analysis that would improve the owner's own sessions.

## 3. Where the chars are

From the budget print and the scratch decomposition:

| bucket | chars | share |
| --- | ---: | ---: |
| leaf `description` strings (1,191 fields, longest 120) | 78,173 | 38.1% |
| structural JSON (`type`, `properties`, `required`, `items`, `anyOf`, …) | 84,092 | 41.0% |
| tool descriptions | 16,261 | 7.9% |
| union-member descriptions | 8,743 | 4.3% |
| enums | 8,497 | 4.1% |
| the 11 union tools together | 100,359 | 49.0% |
| `manage-placeables` alone (350 leaves, 35 members) | 48,610 | 23.7% |
| the `actors` toolset (25 tools) | 74,885 | 36.5% |
| the `scenes` toolset (7 tools) | 62,098 | 30.3% |

Per tool: mean 2,531 chars, median 900, max 48,610, min 242. The structural 41% is about 70 chars per
leaf and is inherent to having 1,191 leaves; it does not shrink without fewer leaves or fewer tools
advertised at once.

The structural levers the issue names, measured:

| lever | chars saved on the eager list | share | verdict |
| --- | ---: | ---: | --- |
| drop `additionalProperties:false` on the 82 union members only / on all 152 closed objects (dispatch already refuses unknown keys by name in `_union.ts` and `registry.ts`) | 2,378 / 4,408 | 1.2% / 2.1% | cheap and low-risk for the members: the dispatcher's refusal is the real guard; a client that validates before sending loses an early typo check. Dropping it everywhere also breaks the test that the top level is closed |
| hoist the repeated enum arrays into `$defs` | 188 net: only 14 of the 23 repeat within one tool, and `tools/list` has no shared `$defs` across tools | under 0.1% | not worth it. The SDK's `ToolSchema` would let it through (its `inputSchema` has a `catchall`, and zod 4 can emit `$ref` with `reused: 'ref'`), but `$ref` support varies by client and it is unknown whether Claude Code's merge resolves it |
| move the member descriptions out of the schema | 10,137 if dropped; about 1,300 if folded into the family descriptions (which would need the 400-char cap raised) | 4.9% / 0.6% | they are invisible in Claude Code already (the merge drops `anyOf`); in an eager client they are the only per-action guidance; keep them |
| split `manage-placeables` by kind into 8 tools | +3,415 on the eager list (the family description repeated), +185 chars on the names budget per registration (6,143 → about 6,513 for two) | — | the eager number does not move; in Claude Code each kind would cost 3.8–10.4k with the right shapes instead of 13.2k with one kind's; nine skills re-pointed |
| per-kind key names inside the one tool (`tiles`, `lights`, … instead of one `items`) | about 0 | — | the same correction for the deferred view with no new names; the cheaper shape |
| a second-tier toolset off by default (the 23 tools no skill names) | 16,741 | 8.2% | a direct request for one of them is refused by name and needs a client restart; changes the documented "unset = the whole surface" |
| add `readOnlyHint` annotations to the 23 read tools | −830 (a cost, not a saving) | — | noted because `measure.ts` would count them; none are advertised today |

So no structural diet reaches the headroom the issue asks for ("real headroom for the next few
features") without changing what is advertised by default. The prose is already at its floor by the
M7 rule. The honest answer is a policy change, not another diet, with the union-member
`additionalProperties` as the one cheap number if one is needed this week.

## 4. What the budgets should be

Three budgets with named payers, instead of one ceiling that stands for all of them:

1. **Per prompt, deferred client (Claude Code): names ×2 plus the skill descriptions.** Today 13,916
   chars. This is what the owner pays on every turn. Keep it ratcheted tightly; it has headroom today
   (857 on names, 227 on skills) and a new tool costs it about 90 chars.
2. **Per fetch, deferred client: the largest single tool's flattened size, and a flatten-safety
   rule.** A fetched tool costs its flattened chars each time a session needs it; `manage-placeables`
   costs 13k and shows the wrong shapes. The rule: no key may carry two described shapes across a
   union's members (the scratch measurement's "lossy keys" column must be empty), and no single tool
   over a stated size. This is the budget that improves the owner's sessions.
3. **The eager list, with headroom and a per-family table.** The test comment says "M8 keeps each
   family ≤ today" but only the total is asserted. Make it a table: each toolset's ceiling, raised
   only in the commit that grows that family, with the reason in the comment, and a total set with
   working headroom (the M7 target was 230,000; 220,000 leaves 7% and keeps the diet's gain). A change
   that adds advertised chars pays in its own family or raises that family's row. That is the issue's
   option 2 made mechanical, and it answers the complaint that today a lights change trims the
   token fields.

## 5. The recommendation for issue #18

In order:

1. **Write the three budgets into `measure.test.ts`** (one commit, no tool change): the per-prompt
   total, the per-fetch maximum with the flatten-safety assertion, the per-family eager table with the
   total raised to 220,000. Record in the test comment who pays each.
2. **Make `manage-placeables` flatten-safe.** The cheapest shape is per-kind keys for the colliding
   leaves (`tiles`, `lights`, `walls`, … instead of one `items`; the same for `patches` and `ids`), so
   the merged view carries every kind's real fields under its own key. The eager size stays about the
   same; the names budget is untouched; the skill lines that name `items` on placeables are re-pointed
   in the same commit (`scripts/measure/skills-matrix.mjs` must stay at 0 unresolved). The alternative,
   eight per-kind tools, costs about 185 name chars per registration and 3,415 on the eager list, and
   is the better shape only if the per-kind tools would also take different toolsets.
3. **Fix the smaller lossy keys** the same way (`manage-rolltables` five keys, `manage-journals`
   `pageId`, `search-compendium` `limit`): a member that re-describes a root leaf differently is a
   drift the new assertion catches.
4. **Measure the other clients once.** Connect Claude Desktop (and whichever client the sharing pass
   names next) and read what they load: eager or deferred, flattened or not. One session, one note in
   `docs/contracts.md`. Until then, the eager ceiling stands for "the clients we have not measured".
5. Leave `$defs` alone, and take the union members' `additionalProperties` (2,378 chars) only if a
   number is needed before step 1 lands.
6. **Say what the project is.** CONTRIBUTING and design.md call the server "in maintenance since
   3.0.0 with no roadmap", and 4.x has shipped receipts and undo, `run-script`, the read-only mode,
   `init` and `doctor`, seat records, the op cap, the lights whole and `asToken`: twelve new source
   files and 5,790 added lines. design.md's own §9 rule says a capability is written there first.
   The budget policy only means something once the document that owns growth admits growth is
   happening.

Done when `npm test` prints the three budgets with their payers, the lossy-keys assertion is green,
a feature that grows a family raises that family's row in the same commit, and design.md names the
4.x line.

## Appendix: the scratch measurement

A vitest file that builds the registry the way `measure.test.ts` does (`buildToolRegistry` with the
test fakes, no toolsets), and for each advertised tool: `JSON.stringify` chars; the number of `anyOf`
members; the flattened view (root properties, then each member's properties with the first member
winning a key, `additionalProperties: true`, `anyOf` removed) and its chars; and the keys whose shape
differs across members, counting only shapes that carry a `description` (a bare `{type}` member leaf
defers to the root's prose by design). Also counts `"additionalProperties":false` occurrences across
the list and identical `enum` arrays that repeat. The merge rule is the one observed in Claude Code's
ToolSearch result on 2026-10-15; if the harness changes its rendering, re-observe before trusting the
flattened column.
