#!/usr/bin/env node
// upstream-surface.mjs - write watch/surface.json: the Foundry and dnd5e names each public repo's
// shipped code uses, read from the sibling clones.
//
// The upstream watch (tools/upstream-watch.mjs) runs in a GitHub Action with no clones, so it
// matches release notes and the dnd5e tag diff against this file to turn each repo's checklist row
// into leads. Generated, never hand-kept: rerun it with the integration map and commit the result.
//
//   node tools/upstream-surface.mjs            write watch/surface.json
//   node tools/upstream-surface.mjs --check    exit 1 if the file is stale
//
// Read-only on the siblings. Tests, tools, docs and scratch are left out: a lead should point at
// code a world runs.

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "watch", "surface.json");
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".claude", "prototypes", "shelved", "audits",
  "docs", "history", "scratch", "tools", "test", "tests", "scripts-dev"]);
const SOURCE = /\.(m?js|ts)$/;
const NOT_SHIPPED = /\.test\.|\.bundle\.|\/tests?\//;

const { repos } = JSON.parse(readFileSync(join(ROOT, "repos.json"), "utf8"));
const tracked = repos.filter((r) => r.visibility === "public" && r.status === "active" && ["mod", "mcp"].includes(r.kind));

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (SOURCE.test(entry.name) && !NOT_SHIPPED.test(p.replace(/\\/g, "/"))) out.push(p);
  }
  return out;
}

// A document hook names its document: createActiveEffect, preUpdateToken, deleteCombat.
const DOC_HOOK = /^(?:pre)?(?:create|update|delete)([A-Z]\w+)$/;
// Namespace segments, not names a release note would mention.
const GENERIC = new Set(["api", "apps", "implementation", "ux", "elements", "fields", "types", "sheets", "hud",
  "layers", "placeables", "handlebars", "collections", "abstract", "instances", "values", "keys", "entries", "get"]);
// The server routes the bridge and the deploy scripts drive.
const ROUTE = /["'`](?:\$\{[^}]+\})?\/(join|setup|auth|upload|license|api\/status)\b/g;

/* -------------------------------------------- */
/*  Patched: the Foundry and dnd5e methods wrapped or overridden in place                  */
/* -------------------------------------------- */

// A wrap on someone else's prototype is invisible to the hook and API sets above, and a release
// that renames the method breaks it silently. Recorded as "Owner#method" when the owner resolves
// from the file (`const Base = dnd5e.applications.actor.BaseActorSheet` ... `Base.prototype.x =`),
// else as the bare method. Four shapes: a function assigned onto a prototype (directly, or through
// a variable holding one), Object.defineProperty on a prototype, a libWrapper registration, and a
// mixin (`Token => class extends Token { ... super.isVisible ... }`) that replaces a CONFIG class.
const ASSIGN = /(?<![\w$.])([A-Za-z_$][\w$]*)(\??\.prototype)?\??\.([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\b|\([^()]*\)\s*=>)/g;
const DEFINE = /Object\.defineProperty\(\s*([A-Za-z_$][\w$]*)(\??\.prototype)?\s*,\s*["'`]([\w$]+)["'`]/g;
const LIBWRAP = /libWrapper\.register\(\s*[^,]+,\s*["'`]([\w$.]+)["'`]/g;
const MIXIN = /([A-Za-z_$][\w$]*)\s*=>\s*class\s+extends\s+\1\b/;

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The class an expression names: `CONFIG.Token?.objectClass?.prototype` is Token. */
function ownerOfPath(expr) {
  const path = expr.split("??")[0].replace(/\?\./g, ".").replace(/^globalThis\./, "").trim();
  const seg = path.split(".").filter(Boolean).filter((s) => s !== "prototype");
  const last = seg.at(-1);
  if (!last || !/^[A-Za-z_$][\w$]*$/.test(last)) return null;
  const prev = seg.at(-2);
  if (last === "objectClass" || last === "documentClass") {
    if (seg.at(-3) === "activityTypes" && prev) return `${cap(prev)}Activity`;
    return prev ?? null;
  }
  if (prev === "dataModels") return `${last.length <= 3 ? last.toUpperCase() : cap(last)}Data`;
  if (/^[a-z]/.test(last) && seg.length > 1) return cap(last); // CONFIG.Canvas.fogManager
  return last;
}

/**
 * Every binding in a file, by name: `const|let|var name = expr`, `for (const name of expr)`, and
 * function parameters (whose value the file cannot tell: expr null), each at its offset.
 */
function definitions(source) {
  const defs = new Map();
  const add = (name, at, expr) => {
    const list = [...(defs.get(name) ?? []), { at, expr: expr === null ? null : expr.trim() }];
    defs.set(name, list.sort((a, b) => a.at - b.at));
  };
  for (const m of source.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)/g)) add(m[1], m.index, m[2]);
  for (const m of source.matchAll(/for\s*\(\s*(?:const|let)\s+([A-Za-z_$][\w$]*)\s+of\s+([^\n]+?)\)\s*\{?\s*$/gm)) add(m[1], m.index, m[2]);
  const params = (list, at) => {
    for (const p of list.split(",")) {
      const name = p.trim().replace(/^\.\.\./, "").split(/[=\s]/)[0];
      if (/^[A-Za-z_$][\w$]*$/.test(name)) add(name, at, null);
    }
  };
  for (const m of source.matchAll(/\bfunction\b\s*[\w$]*\s*\(([^()]*)\)/g)) params(m[1], m.index);
  for (const m of source.matchAll(/\(([^()]*)\)\s*=>/g)) params(m[1], m.index);
  for (const m of source.matchAll(/(?<![\w$.)])([A-Za-z_$][\w$]*)\s*=>/g)) params(m[1], m.index);
  return defs;
}

/** The owners an identifier stands for at offset `at`: the nearest definition before it, followed through. */
function ownersOf(name, at, defs, depth = 0) {
  if (depth > 4) return [];
  const before = (defs.get(name) ?? []).filter((d) => d.at < at);
  const def = before.at(-1) ?? defs.get(name)?.[0];
  if (!def?.expr) return [];
  const list = def.expr.match(/\[([^\]]*)\]/);
  const parts = list ? list[1].split(",") : [def.expr];
  const out = [];
  for (const part of parts) {
    const expr = part.trim();
    if (!expr) continue;
    const head = expr.replace(/\?\./g, ".").split(/[.\s?]/)[0];
    if (/^[A-Za-z_$][\w$]*$/.test(expr.replace(/\?\.prototype|\.prototype/g, "").split(/\s/)[0]) && defs.has(head) && head !== name) {
      const deeper = ownersOf(head, def.at, defs, depth + 1);
      if (deeper.length) {
        out.push(...deeper);
        continue;
      }
    }
    const owner = ownerOfPath(expr);
    if (owner) out.push(owner);
  }
  return [...new Set(out)];
}

/** The patched names in one file's source. */
function patchedIn(source) {
  const defs = definitions(source);
  const out = new Set();
  const record = (owners, method) => {
    if (!owners.length) out.add(method);
    for (const o of owners) out.add(`${o}#${method}`);
  };
  for (const m of source.matchAll(ASSIGN)) {
    const [, base, viaPrototype, method] = m;
    if (viaPrototype) {
      record(ownersOf(base, m.index, defs), method);
      continue;
    }
    // `proto.method = function`: only when the variable holds a prototype.
    const def = (defs.get(base) ?? []).filter((d) => d.at < m.index).at(-1);
    if (!def || !/\.prototype\b/.test(def.expr)) continue;
    const owner = ownerOfPath(def.expr);
    const head = def.expr.replace(/\?\./g, ".").split(".")[0];
    record(owner === head || !owner ? ownersOf(head, def.at, defs) : [owner], method);
  }
  for (const m of source.matchAll(DEFINE)) {
    const [, base, viaPrototype, method] = m;
    const def = (defs.get(base) ?? []).filter((d) => d.at < m.index).at(-1);
    if (viaPrototype) record(ownersOf(base, m.index, defs), method);
    else if (def && /\.prototype\b/.test(def.expr)) record([ownerOfPath(def.expr)].filter(Boolean), method);
  }
  for (const m of source.matchAll(LIBWRAP)) {
    const seg = m[1].split(".");
    record([ownerOfPath(seg.slice(0, -1).join("."))].filter(Boolean), seg.at(-1));
  }
  const mixin = source.match(MIXIN);
  if (mixin) for (const m of source.matchAll(/\bsuper\.([A-Za-z_$][\w$]*)/g)) out.add(`${mixin[1]}#${m[1]}`);
  return out;
}

const surface = {};
const missing = [];
for (const r of tracked) {
  const dir = join(ROOT, r.name);
  if (!existsSync(join(dir, ".git")) || !statSync(join(dir, ".git")).isDirectory()) { missing.push(r.name); continue; }
  const sets = { dnd5eHooks: new Set(), coreHooks: new Set(), documents: new Set(), dnd5eConfig: new Set(), api: new Set(), routes: new Set(), patched: new Set() };
  for (const f of walk(dir)) {
    const s = readFileSync(f, "utf8");
    // Hooks.on/once, and By the Books' listen(name, tag, fn) wrapper.
    for (const m of s.matchAll(/\b(?:Hooks\.(?:on|once)|listen)\(\s*["'`]([\w.]+)["'`]/g)) {
      const h = m[1];
      if (h.startsWith("dnd5e.")) sets.dnd5eHooks.add(h);
      else if (!h.includes(".")) {
        sets.coreHooks.add(h);
        const doc = h.match(DOC_HOOK)?.[1];
        if (doc) sets.documents.add(doc);
      }
    }
    for (const m of s.matchAll(/CONFIG\.DND5E\.(\w+)/g)) sets.dnd5eConfig.add(m[1]);
    for (const m of s.matchAll(/foundry\.(?:utils|documents|canvas|applications|data|dice|audio)\.(?:[\w]+\.)*(\w+)/g)) {
      if (!GENERIC.has(m[1])) sets.api.add(m[1]);
    }
    for (const m of s.matchAll(ROUTE)) sets.routes.add(`/${m[1]}`);
    for (const p of patchedIn(s)) sets.patched.add(p);
  }
  // A bare name the same repo also records with its owner says nothing more.
  for (const p of [...sets.patched]) if (!p.includes("#") && [...sets.patched].some((q) => q.endsWith(`#${p}`))) sets.patched.delete(p);
  surface[r.name] = Object.fromEntries(Object.entries(sets).map(([k, v]) => [k, [...v].sort()]));
}

const text = `${JSON.stringify({ $comment: "Generated by tools/upstream-surface.mjs from the sibling clones. Do not edit; rerun it.", repos: surface }, null, 2)}\n`;
if (missing.length) {
  console.error(`not cloned here: ${missing.join(", ")}; run .\\sync.ps1 first`);
  process.exit(1);
}
if (process.argv.includes("--check")) {
  const old = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  if (old !== text) { console.error("watch/surface.json is stale: run node tools/upstream-surface.mjs"); process.exit(1); }
  console.log("watch/surface.json is current");
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, text);
  const n = (k) => Object.values(surface).reduce((a, s) => a + s[k].length, 0);
  console.log(`wrote watch/surface.json: ${Object.keys(surface).length} repos, ${n("dnd5eHooks")} dnd5e hooks, ${n("coreHooks")} core hooks, ${n("dnd5eConfig")} CONFIG.DND5E keys, ${n("api")} API names, ${n("routes")} routes, ${n("patched")} patched methods`);
}
