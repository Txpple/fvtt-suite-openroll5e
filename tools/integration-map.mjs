#!/usr/bin/env node
// integration-map.mjs - regenerate docs/integration-map.md from the sibling clones.
//
// Scans every fvtt-mod-*, fvtt-mcp-* and fvtt-app-* clone next to this repo's root and writes a
// Markdown report: each module's manifest facts, which siblings reference which (by package id in
// source), and the custom hooks each one emits or listens to. Run it after a module is added,
// renamed or retired, and commit the result:
//
//   node tools/integration-map.mjs
//
// Read-only; it never touches the sibling clones.

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "docs", "integration-map.md");
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".claude", "prototypes", "shelved", "audits", "scratch"]);
const SOURCE = /\.(m?js|ts)$/;

// A sibling is a directory whose .git is a directory (a worktree's .git is a file; skip those so a
// feature-branch checkout of a module does not count twice).
function isPrimaryClone(dir) {
  const git = join(dir, ".git");
  return existsSync(git) && statSync(git).isDirectory();
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (SOURCE.test(entry.name)) out.push(p);
  }
  return out;
}

const siblings = readdirSync(ROOT)
  .filter((d) => /^fvtt-(mod|mcp|app)-/.test(d) && isPrimaryClone(join(ROOT, d)))
  .sort();

const modules = [];
const packageIds = new Set();
for (const name of siblings) {
  const manifestPath = join(ROOT, name, "module.json");
  if (!existsSync(manifestPath)) continue;
  const m = JSON.parse(readFileSync(manifestPath, "utf8"));
  packageIds.add(m.id);
  const rel = m.relationships ?? {};
  const ids = (k) => (rel[k] ?? []).map((r) => r.id);
  modules.push({
    name,
    id: m.id,
    title: m.title,
    version: m.version,
    compat: `${m.compatibility?.minimum ?? "?"}–${m.compatibility?.verified ?? "?"}`,
    systems: ids("systems"),
    requires: ids("requires"),
    recommends: ids("recommends"),
  });
}
// Retired ids still referenced in source are worth catching, a renamed module's old hooks among them
// (By the Books 3.0.0 still emits battleflow.* for one release). The list is the manifest's retired rows.
for (const r of JSON.parse(readFileSync(join(ROOT, "repos.json"), "utf8")).repos) {
  if (r.status === "retired" && r.kind === "mod") packageIds.add(r.name);
}

// Hook prefixes: "bythebooks.moment", "fxstudio.rebuilt", or "fvtt-mod-x.y".
const hookPrefixes = [...packageIds].map((id) => id.replace(/^fvtt-mod-/, ""));
const isSuiteHook = (h) => hookPrefixes.some((p) => h.startsWith(`${p}.`) || h.startsWith(`fvtt-mod-${p}.`));

// Shipped code first, then tools, tests and docs, so "first seen in" points at the real integration.
const rank = (f) => {
  const p = f.replace(/\\/g, "/");
  if (/\/(docs|history|scratch)\//.test(p)) return 3;
  if (/\.test\.|\/tests?\//.test(p)) return 2;
  if (/\/tools\//.test(p)) return 1;
  return 0;
};

const rows = [];
for (const name of siblings) {
  const files = walk(join(ROOT, name)).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  const refs = new Map();
  const emits = new Map();
  const listens = new Map();
  const where = new Map(); // id -> first file
  const texts = files.map((f) => [f, readFileSync(f, "utf8")]);
  // A hook helper: By the Books publishes its hooks through core.js `publish(name, ...)`, which fires
  // `<prefix>.<name>` for each prefix its body names (in 3.0.x its own and the old `battleflow`).
  // A literal `publish("x")` counts as an emit under every prefix, a variable one as
  // `<prefix>.${var}`, and the helper's own template literals are not rows of their own.
  const helperPrefixes = new Set();
  for (const [, s] of texts) {
    const def = s.match(/export function publish\(name[^)]*\)\s*\{([\s\S]*?)\n\}/);
    if (!def) continue;
    for (const m of def[1].matchAll(/Hooks\.(?:call|callAll)\(\s*`([\w-]+)\.\$\{name\}`/g)) helperPrefixes.add(m[1]);
  }
  for (const [f, s] of texts) {
    for (const id of packageIds) {
      if (id === name) continue;
      const n = (s.match(new RegExp(`["'\`]${id}["'\`.]`, "g")) ?? []).length;
      if (n) {
        refs.set(id, (refs.get(id) ?? 0) + n);
        if (!where.has(id)) where.set(id, relative(ROOT, f).replace(/\\/g, "/"));
      }
    }
    for (const m of s.matchAll(/Hooks\.(call|callAll)\(\s*["'`]([^"'`]+)["'`]/g)) {
      if (helperPrefixes.size && /^[\w-]+\.\$\{name\}$/.test(m[2])) continue;
      if (isSuiteHook(m[2])) emits.set(m[2], (emits.get(m[2]) ?? 0) + 1);
    }
    for (const m of s.matchAll(/(?<!function\s*)\bpublish\(\s*(?:["'`]([\w.-]+)["'`]|([A-Za-z_$][\w$]*))\s*[,)]/g)) {
      for (const p of helperPrefixes) {
        const h = m[1] ? `${p}.${m[1]}` : `${p}.\${${m[2]}}`;
        if (isSuiteHook(h)) emits.set(h, (emits.get(h) ?? 0) + 1);
      }
    }
    for (const m of s.matchAll(/Hooks\.(on|once)\(\s*["'`]([^"'`]+)["'`]/g)) {
      if (isSuiteHook(m[2])) listens.set(m[2], (listens.get(m[2]) ?? 0) + 1);
    }
  }
  rows.push({ name, files: files.length, refs, emits, listens, where });
}

const lines = [];
lines.push("# Integration map");
lines.push("");
lines.push(`Generated ${new Date().toISOString().slice(0, 10)} by \`tools/integration-map.mjs\` from the clones next to this file's repo. Do not edit by hand; rerun the script.`);
lines.push("");
lines.push("## Modules");
lines.push("");
lines.push("| Repo | Package id | Foundry title | Version | Foundry | System | Requires |");
lines.push("|---|---|---|---|---|---|---|");
for (const m of modules) {
  lines.push(`| ${m.name} | ${m.id} | ${m.title} | ${m.version} | ${m.compat} | ${m.systems.join(", ") || "any"} | ${[...m.requires, ...m.recommends.map((r) => `${r} (recommended)`)].join(", ") || "none"} |`);
}
lines.push("");
lines.push("## Who references whom");
lines.push("");
lines.push("Occurrences of another suite package's id in source (`game.modules.get`, settings keys, flags, docs strings). A reference means the code knows the other module exists; every module still works alone.");
lines.push("");
lines.push("| From | To | Hits | First seen in |");
lines.push("|---|---|---|---|");
for (const r of rows) {
  for (const [id, n] of [...r.refs].sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${r.name} | ${id} | ${n} | ${r.where.get(id)} |`);
  }
}
lines.push("");
lines.push("## Custom hooks");
lines.push("");
lines.push("Hooks named after a suite module (`bythebooks.*`, `fxstudio.*`, ...). Emitters call them; listeners subscribe. Anything listed under both is the real cross-module contract.");
lines.push("");
lines.push("| Repo | Emits | Listens |");
lines.push("|---|---|---|");
for (const r of rows) {
  if (!r.emits.size && !r.listens.size) continue;
  const fmt = (m) => [...m].map(([h, n]) => `${h} (${n})`).join(", ") || "—";
  lines.push(`| ${r.name} | ${fmt(r.emits)} | ${fmt(r.listens)} |`);
}
lines.push("");

writeFileSync(OUT, `${lines.join("\n")}\n`);
console.log(`wrote ${relative(ROOT, OUT)}: ${modules.length} modules, ${rows.length} repos scanned`);
