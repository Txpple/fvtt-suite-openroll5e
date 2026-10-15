#!/usr/bin/env node
// check-docs.mjs - every CLAUDE.md in the family keeps its rules and one State block; the dated
// journal lives in that repo's docs/log/YYYY-MM.md, release detail in its CHANGELOG or release notes.
//
//   node tools/check-docs.mjs                 one line per CLAUDE.md: ok, or what breaks the rule
//   node tools/check-docs.mjs --check         ...and exit 1 if any file breaks it
//   node tools/check-docs.mjs --list          also print every date seen, with its file and line, and
//                                             whether it sits inside the State block
//   node tools/check-docs.mjs --prefer 4h     read <repo>.4h beside a clone when it exists (a branch's
//                                             worktree, before it is merged)
//
// The rule, for this repo's CLAUDE.md and the CLAUDE.md of every active repo in repos.json that is
// cloned inside this folder (a campaign, "parent": true, lives outside and keeps its own rules):
//   - at most one State block: a line opening `**State (YYYY-MM-DD).**`, within the first
//     STATE_WITHIN lines; the block runs from that line to the first blank line or heading;
//   - no date outside it: an ISO day (2026-10-15, also inside a path or a timestamp) or a month
//     named with its year ("October 2026", "Oct 2026").
// A dated fact belongs in the State block (when it is the current state) or in docs/log/ (when it is
// history). A repo that is not cloned, or has no CLAUDE.md, is reported, not judged.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STATE_WITHIN = 30;
const argv = process.argv.slice(2);
const CHECK = argv.includes("--check");
const LIST = argv.includes("--list");
const preferAt = argv.indexOf("--prefer");
const PREFER = preferAt >= 0 ? argv[preferAt + 1] : null;
const known = new Set(["--check", "--list", "--prefer", ...(PREFER ? [PREFER] : [])]);
const unknown = argv.filter((a) => !known.has(a));
if (unknown.length || (preferAt >= 0 && !PREFER)) {
  console.error(
    `check-docs.mjs: unknown argument ${unknown.join(" ") || "--prefer needs a suffix"}\n` +
      "usage: node tools/check-docs.mjs [--check] [--list] [--prefer <worktree suffix>]",
  );
  process.exit(2);
}

const MONTHS = "jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?";
const DATE = new RegExp(`(?<![0-9])(?:19|20)\\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])(?![0-9])|\\b(?:${MONTHS})\\.? (?:19|20)\\d{2}\\b`, "gi");
const STATE = /^\*\*State \((\d{4}-\d{2}-\d{2})\)\.\*\*/;

/** The State blocks of a file's lines: [{ start, end }], 0-based, end exclusive. */
function stateBlocks(lines) {
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    if (!STATE.test(lines[i])) continue;
    let end = i + 1;
    while (end < lines.length && lines[end].trim() !== "" && !/^#{1,6}\s/.test(lines[end])) end++;
    blocks.push({ start: i, end });
  }
  return blocks;
}

/** Judge one file's text: what breaks the rule, and every date with its line. */
export function judge(text) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks = stateBlocks(lines);
  const inBlock = (i) => blocks.length > 0 && i >= blocks[0].start && i < blocks[0].end;
  const problems = [];
  if (blocks.length > 1) problems.push(`${blocks.length} State blocks (lines ${blocks.map((b) => b.start + 1).join(", ")}); keep one`);
  if (blocks.length && blocks[0].start >= STATE_WITHIN) problems.push(`the State block opens at line ${blocks[0].start + 1}, past line ${STATE_WITHIN}`);
  const dates = [];
  lines.forEach((line, i) => {
    for (const m of line.matchAll(DATE)) {
      const inside = inBlock(i);
      dates.push({ line: i + 1, date: m[0], inside, text: line.trim() });
      if (!inside) problems.push(`line ${i + 1}: ${m[0]} outside the State block`);
    }
  });
  return { problems, dates, state: blocks[0] ? lines[blocks[0].start].match(STATE)[1] : null };
}

/** A repo's folder: its `<name>.<suffix>` worktree when asked for and present, else the clone, else null. */
function dirOf(name) {
  const preferred = PREFER ? join(ROOT, `${name}.${PREFER}`) : null;
  if (preferred && existsSync(preferred)) return preferred;
  const clone = join(ROOT, name);
  return existsSync(clone) ? clone : null;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const manifest = JSON.parse(readFileSync(join(ROOT, "repos.json"), "utf8"));
  const targets = [{ name: "fvtt-suite-openroll5e (this repo)", dir: ROOT }];
  for (const r of manifest.repos.filter((x) => x.status === "active" && !x.parent)) targets.push({ name: r.name, dir: dirOf(r.name) });

  let failing = 0;
  const width = Math.max(...targets.map((t) => t.name.length));
  for (const t of targets) {
    const label = t.name.padEnd(width);
    if (!t.dir) {
      console.log(`${label}  not cloned, skipped`);
      continue;
    }
    const file = join(t.dir, "CLAUDE.md");
    const where = t.dir === ROOT ? "CLAUDE.md" : `${t.dir.slice(ROOT.length + 1)}/CLAUDE.md`;
    if (!existsSync(file)) {
      console.log(`${label}  no CLAUDE.md`);
      continue;
    }
    const { problems, dates, state } = judge(readFileSync(file, "utf8"));
    const head = state ? `State ${state}` : "no State block";
    if (problems.length) {
      failing++;
      console.log(`${label}  FAIL (${head}) ${where}`);
      for (const p of problems) console.log(`${" ".repeat(width)}    ${p}`);
    } else console.log(`${label}  ok (${head}) ${where}`);
    if (LIST) for (const d of dates) console.log(`${" ".repeat(width)}    ${d.inside ? "state " : "OUTSIDE"} ${where}:${d.line} ${d.date}`);
  }
  if (PREFER) console.log(`\n(read <repo>.${PREFER} where it exists)`);
  if (failing) console.log(`\n${failing} CLAUDE.md file(s) break the rule: move each date into the State block or the repo's docs/log/YYYY-MM.md`);
  if (CHECK && failing) process.exit(1);
}
