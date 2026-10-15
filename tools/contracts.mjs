#!/usr/bin/env node
// contracts.mjs - the family's contracts across repos: every consumer's recorded version against its
// emitter's current one, read from the clones.
//
//   node tools/contracts.mjs                  print the table
//   node tools/contracts.mjs --check          ...and exit 1 if any consumer's version is not its emitter's
//   node tools/contracts.mjs --prefer 4f      read <repo>.4f beside a clone when it exists (a branch's
//                                             worktree, before it is merged)
//
// An emitter owns `contracts/<name>.json` with a `version` (By the Books' moment.json and
// card-flags.json, recorded from its battery; Area Sounds' sets.json, held to its engine). A
// consumer names what it reads in `contracts/consumes.json`: `{ consumes: [{ emitter, contract,
// version, test }] }`, the version its own test last passed against. Each consumer's test reads the
// emitter's file from the clone beside it and fails on a mismatch; this is the one view across all
// of them, from repos.json's active repos. A repo that is not cloned is reported, not judged. Run it
// after a contract's version moves, and before a release round.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const CHECK = argv.includes("--check");
const preferAt = argv.indexOf("--prefer");
const PREFER = preferAt >= 0 ? argv[preferAt + 1] : null;
const known = new Set(["--check", "--prefer", ...(PREFER ? [PREFER] : [])]);
const unknown = argv.filter((a) => !known.has(a));
if (unknown.length || (preferAt >= 0 && !PREFER)) {
  console.error(`contracts.mjs: unknown argument ${unknown.join(" ") || "--prefer needs a suffix"}\nusage: node tools/contracts.mjs [--check] [--prefer <worktree suffix>]`);
  process.exit(2);
}

const manifest = JSON.parse(readFileSync(join(ROOT, "repos.json"), "utf8"));
const repos = manifest.repos.filter((r) => r.status === "active" && !r.parent);

/** A repo's folder: its `<name>.<suffix>` worktree when asked for and present, else the clone, else null. */
function dirOf(name) {
  const preferred = PREFER ? join(ROOT, `${name}.${PREFER}`) : null;
  if (preferred && existsSync(preferred)) return preferred;
  const clone = join(ROOT, name);
  return existsSync(clone) ? clone : null;
}
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const shown = (dir) => (dir ? dir.slice(ROOT.length + 1) : "not cloned");

// The emitters: every contracts/<name>.json but consumes.json, by repo and contract name.
const published = new Map();
for (const r of repos) {
  const dir = dirOf(r.name);
  const at = dir ? join(dir, "contracts") : null;
  if (!at || !existsSync(at)) continue;
  for (const file of readdirSync(at).filter((f) => f.endsWith(".json") && f !== "consumes.json").sort()) {
    const c = readJson(join(at, file));
    published.set(`${r.name}/${c.contract ?? file.replace(/\.json$/, "")}`, { repo: r.name, dir, file, version: c.version, readBy: [] });
  }
}

// The consumers: every contracts/consumes.json, each row against its emitter's current file.
const rows = [];
let mismatched = 0;
for (const r of repos) {
  const dir = dirOf(r.name);
  const file = dir ? join(dir, "contracts", "consumes.json") : null;
  if (!file || !existsSync(file)) continue;
  for (const c of readJson(file).consumes ?? []) {
    const key = `${c.emitter}/${c.contract}`;
    const emitter = published.get(key);
    const emitterDir = dirOf(c.emitter);
    let status;
    if (!emitterDir) status = "emitter not cloned";
    else if (!emitter) {
      status = `MISSING: ${shown(emitterDir)} has no contracts/${c.file?.replace(/^contracts\//, "") ?? `${c.contract}.json`}`;
      mismatched++;
    } else if (emitter.version !== c.version) {
      status = `MISMATCH: re-read the contract, then set ${r.name}'s contracts/consumes.json (its test: ${c.test ?? "?"})`;
      mismatched++;
    } else status = "ok";
    if (emitter) emitter.readBy.push(r.name);
    rows.push({ consumer: r.name, contract: key, theirs: c.version, emitters: emitter?.version ?? "-", status, from: shown(dir), to: shown(emitterDir) });
  }
}

const w = (rows, k, min) => Math.max(min, ...rows.map((x) => String(x[k]).length));
const cols = [["consumer", "Consumer"], ["contract", "Contract"], ["theirs", "Reads"], ["emitters", "Emitter's"], ["status", "Status"]];
const widths = Object.fromEntries(cols.map(([k, h]) => [k, w(rows, k, h.length)]));
const line = (x) => cols.map(([k]) => String(x[k]).padEnd(widths[k])).join("  ").trimEnd();
console.log(line(Object.fromEntries(cols.map(([k, h]) => [k, h]))));
console.log(cols.map(([k]) => "-".repeat(widths[k])).join("  "));
for (const x of rows) console.log(line(x));
if (!rows.length) console.log("(no consumer names a contract yet)");

console.log("\npublished:");
for (const [key, e] of [...published].sort()) {
  console.log(`  ${key.padEnd(34)} v${String(e.version).padEnd(4)} ${shown(e.dir).padEnd(28)} read by ${e.readBy.length ? e.readBy.join(", ") : "nobody in the family"}`);
}
if (PREFER) console.log(`\n(read <repo>.${PREFER} where it exists)`);
if (mismatched) console.log(`\n${mismatched} consumer row(s) out of step with their emitter`);
if (CHECK && mismatched) process.exit(1);
