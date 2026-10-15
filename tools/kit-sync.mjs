#!/usr/bin/env node
// kit-sync.mjs - the Open Roll 5e kit's copies, kept byte-identical in every module that holds it.
//
// "Every module installs and works alone" holds: the kit travels as copies, never as a shared
// dependency, the way the README sections do. The source of truth is this repo's templates/kit/:
//
//   templates/kit/<name>.js          ->  <module>/scripts/kit/<name>.js
//   templates/kit/tests/<name>.js    ->  <module>/tests/kit/<name>.js
//
// The copies go into every repo repos.json marks `"kit": true` (active ones), and into this repo's
// module template, templates/module/, which always holds the kit.
//
//   node tools/kit-sync.mjs                     write every copy that differs, and remove a kit file
//                                               the source no longer has
//   node tools/kit-sync.mjs --check             report what differs and exit 1 if anything does
//   node tools/kit-sync.mjs --dir <repo>=<path> look for <repo> at <path> for this run (repeatable;
//                                               relative to the current directory). A repo named
//                                               here takes part even when repos.json does not mark
//                                               it, so a worktree can be checked before the merge.
//
// Edit the kit in templates/kit/, run this, then commit each module's copy in its own repo. A
// module's own copy is never edited by hand: --check reports it as drift.
//
// Bytes are compared after reading CRLF as LF, since a Windows checkout without the repo's
// .gitattributes holds CRLF and git stores the same blob either way; a copy is written LF.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "templates", "kit");
const TEMPLATE = join(ROOT, "templates", "module");
const args = process.argv.slice(2);
const CHECK = args.includes("--check");

const overrides = new Map();
for (let i = 0; i < args.length; i++) {
  if (args[i] !== "--dir") continue;
  const spec = args[++i] ?? "";
  const at = spec.indexOf("=");
  if (at < 1) {
    console.error(`kit-sync: --dir wants <repo>=<path>, got "${spec}"`);
    process.exit(2);
  }
  overrides.set(spec.slice(0, at), resolve(spec.slice(at + 1)));
}

const toLF = (text) => text.replace(/\r\n/g, "\n");

/** The kit's files: [{ from, to }], `to` relative to a module's root, forward slashes. */
function kitFiles() {
  const out = [];
  const add = (dir, into) => {
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      if (statSync(full).isFile() && name.endsWith(".js")) out.push({ from: full, to: `${into}/${name}` });
    }
  };
  add(SOURCE, "scripts/kit");
  if (existsSync(join(SOURCE, "tests"))) add(join(SOURCE, "tests"), "tests/kit");
  return out;
}

const manifest = JSON.parse(readFileSync(join(ROOT, "repos.json"), "utf8"));
const marked = manifest.repos.filter((r) => r.kit === true && r.status === "active").map((r) => r.name);
const names = [...new Set([...marked, ...overrides.keys()])];
const targets = [
  ...names.map((name) => ({ name, dir: overrides.get(name) ?? join(ROOT, name) })),
  { name: "templates/module", dir: TEMPLATE },
];

const files = kitFiles();
if (!files.length) {
  console.error(`kit-sync: no kit files under ${relative(ROOT, SOURCE)}`);
  process.exit(2);
}
const wanted = new Set(files.map((f) => f.to));

let stale = 0;
for (const t of targets) {
  const label = t.name.padEnd(26);
  if (!existsSync(join(t.dir, "module.json"))) {
    console.log(`${label} not here (${relative(ROOT, t.dir) || "."}); skipped`);
    continue;
  }
  const drift = [];
  for (const f of files) {
    const want = toLF(readFileSync(f.from, "utf8"));
    const at = join(t.dir, f.to);
    const have = existsSync(at) ? toLF(readFileSync(at, "utf8")) : null;
    if (have === want) continue;
    drift.push(`${have === null ? "missing" : "differs"}: ${f.to}`);
    if (!CHECK) {
      mkdirSync(dirname(at), { recursive: true });
      writeFileSync(at, want);
    }
  }
  // A kit file the source no longer has.
  for (const into of ["scripts/kit", "tests/kit"]) {
    const dir = join(t.dir, into);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const rel = `${into}/${name}`;
      if (!name.endsWith(".js") || wanted.has(rel)) continue;
      drift.push(`not in the kit: ${rel}`);
      if (!CHECK) rmSync(join(dir, name));
    }
  }
  if (!drift.length) {
    console.log(`${label} up to date (${files.length} files)`);
    continue;
  }
  stale++;
  console.log(`${label} ${CHECK ? "OUT OF DATE" : "written"}`);
  for (const d of drift) console.log(`  ${d}`);
}
if (CHECK && stale) process.exit(1);
