# Plan — the dnd5e MCP's per-prompt budget: two rows that add up, and a way to grow

**Drafted 2026-10-19; nothing here is built.** From a session asking why `fvtt-mcp-dnd5e` "keeps hitting the 14,000
char limit". The limit is the MCP's own ratchet, not Claude Code's. This plan makes its ceiling the sum of its two rows
and gives each row the rule the toolset rows already have. One commit in `fvtt-mcp-dnd5e` (a test, two docs, a print
label, a CHANGELOG entry); no tool, schema or skill changes, and no release of its own. It amends §4.1 of
[the tool-surface review](../reviews/2026-10-15-mcp-tool-surface.md). Work it from a session in the MCP's clone (the
suite's rule for work inside one repo). The decisions it needs are at the end.

## What the number is

Budget (a) of `src/measure.test.ts`, per prompt for a deferred client (Claude Code): the 81 tool names once per
registration plus the 17 skills' front-matter descriptions, paid on every turn. At 4.6.2 (the live `npm test`,
2026-10-19):

| row | now | ceiling | room |
| --- | ---: | ---: | ---: |
| `nameChars`, the names ×2 | 6,143 | 7,000 | 857 |
| `skillDescriptionChars`, the 17 descriptions | 7,852 | 8,000 | 148 |
| `perPrompt`, the total | 13,995 | 14,000 | **5** |

## Why it keeps refusing

- **The total is tighter than its rows.** The rows allow 15,000 and the total stops at 14,000, so the total is the wall.
  4.6.2 is the case: the bestiary-builder rewrite put the skills row at 7,888, inside its 8,000, and the total at
  14,031; the description was reworded until the total fit (13,995).
- **The review counted the rows' room; the test kept the total's.** §4.1 says the budget "has headroom today (857 on
  names, 227 on skills)". The commit that wrote it (`0bbe4ff`, 2026-10-15) rounded that day's 13,916 up to 14,000,
  which left 84.
- **Nothing says how it may grow.** CONTRIBUTING §5 and design.md §8 give the toolset rows a rule: a change pays in its
  own row, or raises that row in the same commit with the reason beside it. The per-prompt budget has only the
  ratchet, so a session that trips it can only trim skill prose until the number fits, the trade §1 of the review set
  out to end.

## What Claude Code itself limits

From its docs, read 2026-10-19 ([skills](https://code.claude.com/docs/en/skills#skill-descriptions-are-cut-short),
[MCP](https://code.claude.com/docs/en/mcp#scale-with-mcp-tool-search),
[settings](https://code.claude.com/docs/en/settings-reference)):

- **Tool names** under tool search (the default): no fixed cap; the context window is the practical limit. The names
  row is a cost the project chose to bound, not a limit anything enforces.
- **Skill descriptions**: one listing, one budget, `skillListingBudgetFraction`, default 0.01 (1% of the model's
  context window; `SLASH_COMMAND_TOOL_CHAR_BUDGET` is the legacy fixed-character override, 8,000 characters the
  fallback). Over it nothing fails: the descriptions of the least-used skills are dropped and every name stays, so a
  rarely used skill stops matching its trigger phrases. Each description (with `when_to_use`) is cut at 1,536
  characters (`skillListingMaxDescChars`).
- **The listing is the family's, not this repo's.** It holds every skill a session offers. This family's 19 (these 17,
  imagegen's `art-audit` at 845, the longest, and Session Scribe's `session-scribe` at 521) come to 9,218 characters,
  about 2,560 tokens by the test's estimate. That fits a 1M-token window's budget (a session on 2026-10-19 showed every
  description whole); on its own it passes a 200k window's 2,000 tokens and the 8,000-character fallback.

So the 14,000 models this repo's share of each turn, held as a discipline. The discipline is worth keeping; trimming
prose to meet it is not.

## The change

All in `fvtt-mcp-dnd5e`, one commit on `main`:

1. **`src/measure.test.ts`: the ceiling is its rows' sum.** Drop `perPrompt: 14_000` from `BUDGET`; derive
   `const PER_PROMPT = BUDGET.nameChars + BUDGET.skillDescriptionChars;` and assert and print against it
   (`(≤ 15,500: names + skills)`). The assertion holds by construction once both rows are asserted; it stays, so the
   test still names the budget the owner pays.
2. **The rows.** `nameChars` stays 7,000 (6,143; room for about ten tools at 75 to 90 chars each over two
   registrations). `skillDescriptionChars` goes 8,000 → 8,500 (7,852; 648 of room, 8%, the working headroom tools/list
   got on 2026-10-15). The per-prompt ceiling becomes 15,500 chars, about 4.3k tokens: at most 1,500 chars (about 400
   tokens) a turn above today's ceiling. Each row's comment keeps its history and adds this commit's line.
3. **The rule, written where the toolset rule is.** The test's header ("Every ceiling is today's measurement rounded
   up; a diet lowers its ceiling in the same commit …") gains its other half, and CONTRIBUTING §5 and design.md §8
   *The budgets* gain one sentence: *a new tool pays in the names row and a longer skill description in the skills
   row, or raises that row in the same commit, with the reason beside it; a diet lowers it in the same commit.*
   design.md's §4 row for the budgets says the per-prompt ceiling is its rows' sum.
4. **The print label that names the old ceiling.** `scripts/measure/skills-matrix.mjs` prints `(M3 → ≤ 8,000)` beside
   the description total; it names the test's row instead (8,500), the M3 history staying in its header comment.
   `names-cost.mjs`'s `(M8 → ≤ 7,000 for two)` is still right.
5. **CHANGELOG**, an `## Unreleased` entry: the per-prompt budget is two rows that add up (14,000 → 15,500; skills
   8,000 → 8,500, names 7,000), no tool, schema or skill changed. It rides the next release (releases only on the
   owner's word).

**Done when** `npm test` is green and prints `per prompt 13,995 … (≤ 15,500: names + skills)`; `npm run check` and
`npm run typecheck` pass; `npm run build && npm run measure` prints the new row (`dist` is what both registrations
run; the server code is unchanged); `git -C fvtt-mcp-dnd5e grep -nE "14_000|14,000"` answers only `CHANGELOG.md` and
`docs/history/`; and CI on the pushed commit is green.

## Decisions

| # | Decision | Recommended | The other way |
| --- | --- | --- | --- |
| D1 | the skills row | **8,500**: 648 of room, a few sentences across the 17 | 8,000 with the derived total alone (15,000): the row keeps 148, so the next rewrite longer than a sentence refuses again, on the row this time |
| D2 | a cap per skill | **none now**: the row and its rule carry growth; the longest here is 604 (`session-audit`), Claude Code's own cut 1,536 | every description ≤ 700, the skills' twin of the tool prose budget (description ≤ 400), so one skill cannot spend the others' room |
| D3 | the family's whole listing | **not in this plan** | a suite check (`tools/`) of the 19 descriptions against 1% of the smallest window in daily use; worth it only if a 200k-window model becomes a daily client; until then `skillListingBudgetFraction` is the knob |
