#!/usr/bin/env node
// upstream-watch.mjs - the family's watch on Foundry and dnd5e releases.
//
// Run daily by .github/workflows/upstream-watch.yml; needs only Node 22 and a GitHub token (the
// workflow's own, or locally GH_TOKEN / GITHUB_TOKEN / `gh auth token`).
//
//   node tools/upstream-watch.mjs                       read versions, write VERSIONS.md and watch/
//   node tools/upstream-watch.mjs --notify              also open / close the upgrade review issues
//   node tools/upstream-watch.mjs --summary <file>      write the run's summary as JSON to <file>
//
// What it does, each run:
// - Foundry: reads the release notes index. Every channel is recorded (VERSIONS.md's "Newest
//   pre-release"), but only a Stable release is "Latest published" and asks for a review.
// - dnd5e: reads foundryvtt/dnd5e's GitHub releases (drafts and pre-releases skipped).
// - For a package whose Latest published is newer than Reviewed, writes
//   watch/<package>/<latest>.md: the releases it covers, the dnd5e release notes (MIT, kept
//   verbatim) and tag diff, and leads per repo, from matching the notes and the diff against
//   watch/surface.json (tools/upstream-surface.mjs). Foundry's notes are not copied into this
//   public repo; the file links them and quotes only the lines a lead matched.
// - With --notify: one open issue labelled "upgrade review" per package with a review due, with a
//   checklist row per public repo; closed once VERSIONS.md's Reviewed has caught up.
//
// "Reviewed" belongs to the review session, never to this script. stdout is a log for people;
// the machine-readable summary goes only to --summary, never to stdout.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const VERSIONS = join(ROOT, "VERSIONS.md");
const WATCH = join(ROOT, "watch");
const SURFACE = join(WATCH, "surface.json");
const LOG = join(WATCH, "LOG.md");
const OURS = "Txpple/fvtt-suite-openroll5e";
const ERRATA = "Txpple/fvtt-mod-errata5e";
const LABEL = "upgrade review";
const UA = { "user-agent": "fvtt-suite-openroll5e upstream-watch" };
const MAX_LEADS_IN_ISSUE = 5;

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const NOTIFY = args.includes("--notify");
const today = new Date().toISOString().slice(0, 10);

const { repos } = JSON.parse(readFileSync(join(ROOT, "repos.json"), "utf8"));
const FAMILY = repos.filter((r) => r.visibility === "public" && r.status === "active" && ["mod", "mcp"].includes(r.kind));

/* -------------------------------------------- */
/*  Plumbing                                    */
/* -------------------------------------------- */

function cmpVersion(a, b) {
  const pa = String(a).split(".").map(Number), pb = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return Math.sign(d);
  }
  return 0;
}

let token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) { try { token = execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim(); } catch {} }

async function fetchText(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`https://api.github.com/${path}`, {
    method,
    headers: { ...UA, accept: "application/vnd.github+json", ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.status === 204 ? null : res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const decode = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const clip = (s, n = 160) => { const t = s.replace(/\s+/g, " ").trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };

/* -------------------------------------------- */
/*  VERSIONS.md                                 */
/* -------------------------------------------- */

const COLUMNS = ["Package", "Name", "Reviewed", "Reviewed on", "Latest published", "First seen", "Newest pre-release"];

function readVersions() {
  const text = readFileSync(VERSIONS, "utf8").replace(/\r\n/g, "\n");
  const block = text.match(/<!-- versions:start -->\n([\s\S]*?)<!-- versions:end -->/);
  if (!block) throw new Error("VERSIONS.md has no versions block");
  const rows = {};
  for (const line of block[1].split("\n").slice(2)) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    const r = Object.fromEntries(COLUMNS.map((c, i) => [c, cells[i] === "—" ? null : cells[i]]));
    rows[r.Package] = r;
  }
  return { text, rows };
}

function writeVersions(text, rows) {
  const table = [`| ${COLUMNS.join(" | ")} |`, `| ${COLUMNS.map(() => "---").join(" | ")} |`,
    ...Object.values(rows).map((r) => `| ${COLUMNS.map((c) => r[c] ?? "—").join(" | ")} |`)].join("\n");
  writeFileSync(VERSIONS, text.replace(/<!-- versions:start -->\n[\s\S]*?<!-- versions:end -->/, `<!-- versions:start -->\n${table}\n<!-- versions:end -->`));
}

/* -------------------------------------------- */
/*  Upstream reads                              */
/* -------------------------------------------- */

/** Foundry's release notes index: every release, newest first, with its channel. */
async function foundryReleases() {
  const html = await fetchText("https://foundryvtt.com/releases/");
  const out = [...html.matchAll(/href="\/releases\/([\d.]+)"[\s\S]*?release-time">([^<]+)<[\s\S]*?<div class="release-tags">([\s\S]*?)<\/div>/g)]
    .map((m) => ({ version: m[1], date: m[2].trim(), channel: m[3].match(/release-tag (stable|testing|development|prototype)/)?.[1] ?? "unknown",
      url: `https://foundryvtt.com/releases/${m[1]}` }));
  if (!out.length) throw new Error("no releases found on the Foundry release notes page (has its layout changed?)");
  return out;
}

/** One Foundry release's notes, as entries (a heading or a list item each). */
async function foundryNotes(version) {
  const html = await fetchText(`https://foundryvtt.com/releases/${version}`);
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "");
  const start = body.search(/Release Notes<\/h/i);
  return [...body.slice(start >= 0 ? start : 0).matchAll(/<li[^>]*>([\s\S]*?)<\/li>|<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((m) => decode((m[1] ?? m[2]).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 12);
}

/** dnd5e's published releases, newest first. */
async function dnd5eReleases() {
  const list = await api("repos/foundryvtt/dnd5e/releases?per_page=30");
  return list.filter((r) => !r.draft && !r.prerelease && /^release-/.test(r.tag_name))
    .map((r) => ({ version: r.tag_name.replace(/^release-/, ""), tag: r.tag_name, date: r.published_at.slice(0, 10), channel: "stable",
      url: r.html_url, body: (r.body ?? "").replace(/\r\n/g, "\n").trim() }));
}

/* -------------------------------------------- */
/*  Leads                                       */
/* -------------------------------------------- */

const ROUTE_TERMS = {
  "/join": /\/join\b|\bjoin (?:page|form|screen)\b|\bJoin Game Session\b/i,
  "/setup": /\/setup\b|\bsetup (?:page|screen|menu)\b/i,
  "/api/status": /\/api\/status\b/,
};
// Every module listens to these; as words they match ordinary prose ("…know-how to setup…").
const LIFECYCLE = new Set(["init", "i18nInit", "setup", "ready", "canvasInit", "canvasReady"]);
const word = (t) => new RegExp(`(?<![\\w.])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`);

/** Terms a repo's surface offers for one package, each with the kind it came from. */
function termsFor(surface, pkg) {
  // Most specific first, so the leads an issue row shows are the sharpest: a document name like
  // "Token" matches half of any Foundry release.
  const t = [];
  for (const r of surface.routes) if (ROUTE_TERMS[r]) t.push({ kind: "route", term: r, re: ROUTE_TERMS[r] });
  if (pkg === "dnd5e") {
    for (const h of surface.dnd5eHooks) t.push({ kind: "dnd5e hook", term: h, re: word(h) });
    for (const k of surface.dnd5eConfig) t.push({ kind: "CONFIG.DND5E", term: k, re: new RegExp(`\\bDND5E\\.${k}\\b`) });
  }
  for (const a of surface.api) t.push({ kind: "API", term: a, re: word(a) });
  for (const h of surface.coreHooks) if (!LIFECYCLE.has(h)) t.push({ kind: "hook", term: h, re: word(h) });
  for (const d of surface.documents) t.push({ kind: "document", term: d, re: word(d) });
  return t;
}

/** dnd5e's document class a changed file belongs to: module/documents/active-effect.mjs → ActiveEffect. */
const docOfFile = (f) => f.match(/^module\/documents\/([\w-]+)/)?.[1].replace(/\.mjs$/, "")
  .replace(/(^|-)(\w)/g, (_, _d, c) => c.toUpperCase());

/** Match each repo's terms against note entries and (dnd5e) the tag diff's changed lines and files. */
function leadsFor(pkg, notes, diffLines, diffFiles = []) {
  const surface = existsSync(SURFACE) ? JSON.parse(readFileSync(SURFACE, "utf8")).repos : {};
  const out = {};
  for (const r of FAMILY) {
    const s = surface[r.name];
    if (!s) { out[r.name] = null; continue; }
    const leads = [];
    for (const t of termsFor(s, pkg)) {
      for (const n of notes) if (t.re.test(n.text)) leads.push({ ...t, where: `notes ${n.version}`, line: clip(n.text) });
      for (const d of diffLines) if (t.re.test(d.text)) leads.push({ ...t, where: `${d.file}`, line: clip(d.text, 140) });
    }
    for (const f of diffFiles) {
      const doc = docOfFile(f.filename);
      // An activity has no core document hook; a repo on dnd5e's *UseActivity hooks depends on it.
      const uses = doc === "Activity" ? s.dnd5eHooks.some((h) => /Activity/.test(h)) : s.documents.includes(doc);
      if (doc && uses) {
        leads.push({ kind: "changed document", term: doc, where: f.filename, line: `+${f.additions} −${f.deletions} in dnd5e's ${doc} class` });
      }
    }
    // One lead per (term, line): a term that hits the same line twice is one lead.
    const seen = new Set();
    out[r.name] = leads.filter((l) => { const k = `${l.term}|${l.where}|${l.line}`; if (seen.has(k)) return false; seen.add(k); return true; });
  }
  return out;
}

/* -------------------------------------------- */
/*  The review's notes file                     */
/* -------------------------------------------- */

async function buildReview(pkg, name, reviewed, pending, all) {
  const latest = pending[0];
  const notes = [];
  let diffLines = [], diffFiles = [], compareUrl = null;
  const parts = [`# ${name} ${reviewed} → ${latest.version}`, "",
    `Written by \`tools/upstream-watch.mjs\` on ${today}. Leads are matches of each repo's recorded surface (\`watch/surface.json\`) against the notes${pkg === "dnd5e" ? " and the tag diff" : ""}: places to look, not verdicts.`, "",
    "## Releases covered", "", "| Version | Channel | Date | Notes |", "| --- | --- | --- | --- |",
    ...[...pending].reverse().map((r) => `| ${r.version} | ${r.channel} | ${r.date} | ${r.url} |`), ""];
  if (pkg === "foundry") {
    for (const r of pending) for (const text of await foundryNotes(r.version)) notes.push({ version: r.version, text });
    parts.push("Foundry's notes are not copied here: read them at the links above. The leads below quote the lines they matched.", "");
    const pre = all.find((r) => r.channel !== "stable" && cmpVersion(r.version, latest.version) > 0);
    if (pre) parts.push(`A newer pre-release exists: ${pre.version} (${pre.channel}, ${pre.date}). It asks for no review until it is Stable.`, "");
  } else {
    for (const r of pending) for (const text of r.body.split("\n").filter((l) => /^\s*[-*]/.test(l))) notes.push({ version: r.version, text: text.replace(/^\s*[-*]\s*/, "") });
    const base = all.find((r) => r.version === reviewed)?.tag ?? `release-${reviewed}`;
    const cmp = await api(`repos/foundryvtt/dnd5e/compare/${base}...${latest.tag}`);
    compareUrl = cmp.html_url;
    diffFiles = cmp.files ?? [];
    for (const f of diffFiles) for (const l of (f.patch ?? "").split("\n")) if (/^[+-](?![+-])/.test(l)) diffLines.push({ file: f.filename, text: l });
    for (const r of [...pending].reverse()) {
      parts.push(`## dnd5e ${r.version} release notes`, "", "Kept verbatim from foundryvtt/dnd5e (MIT).", "",
        r.body.replace(/^#{1,2} /gm, "### "), "");
    }
    parts.push(`## Tag diff ${base}...${latest.tag}`, "", `${diffFiles.length} file(s), ${cmp.total_commits ?? cmp.commits?.length ?? "?"} commit(s): ${compareUrl}`, "",
      "| File | + | − |", "| --- | --- | --- |", ...diffFiles.slice(0, 300).map((f) => `| ${f.filename} | ${f.additions} | ${f.deletions} |`), "");
  }
  const leads = leadsFor(pkg, notes, diffLines, diffFiles);
  parts.push("## Leads by repo", "");
  for (const r of FAMILY) {
    const l = leads[r.name];
    parts.push(`### ${r.name}`, "");
    if (l === null) parts.push("No surface recorded (not cloned when `watch/surface.json` was generated).", "");
    else if (!l.length) parts.push("No lead.", "");
    else parts.push(...l.map((x) => `- **${x.term}** (${x.kind}), ${x.where}: ${x.line.replace(/\|/g, "\\|")}`), "");
  }
  const file = join(WATCH, pkg, `${latest.version}.md`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${parts.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`);
  return { file: `watch/${pkg}/${latest.version}.md`, leads };
}

/* -------------------------------------------- */
/*  The tracking issue                          */
/* -------------------------------------------- */

function issueBody(pkg, name, reviewed, latest, review, errataIssue) {
  const extra = {
    "fvtt-mcp-dnd5e": pkg === "foundry"
      ? "save the `/join` page as `test/fixtures/join/<version>.html` and run `npm test`; run `npm run smoke:bridge` on the updated sandbox and paste its line here (it records the host's versions)"
      : "run `npm run smoke:bridge` on the updated sandbox and paste its line here",
    "fvtt-mod-errata5e": errataIssue ? `Errata's own version review is ${ERRATA}#${errataIssue}; its result is this row's verdict` : "Errata's own version review (its `version review` issue) is this row's verdict",
  };
  const rows = FAMILY.map((r) => {
    const l = review.leads[r.name];
    const head = `- [ ] **${r.name}**: verdict pending`;
    const lines = [head];
    if (extra[r.name]) lines.push(`  - To do: ${extra[r.name]}.`);
    if (l === null) lines.push("  - No surface recorded.");
    else if (!l.length) lines.push("  - No lead.");
    else {
      for (const x of l.slice(0, MAX_LEADS_IN_ISSUE)) lines.push(`  - Lead: **${x.term}** (${x.kind}), ${x.where}: ${x.line.replace(/#(\d)/g, "#​$1")}`);
      if (l.length > MAX_LEADS_IN_ISSUE) lines.push(`  - …and ${l.length - MAX_LEADS_IN_ISSUE} more in the notes file.`);
    }
    return lines.join("\n");
  });
  return [`| | |`, `| --- | --- |`, `| **Package** | \`${pkg}\` (${name}) |`, `| **Reviewed** | ${reviewed} |`, `| **Latest published** | ${latest.version} (${latest.date}) |`,
    `| **Notes and leads** | [${review.file}](https://github.com/${OURS}/blob/main/${review.file}) |`, "",
    "One row per public repo. Each row gets a one-line verdict in place of *verdict pending* (`no impact`, `breaks: …`, `adopt: …`), a link to that repo's issue when there is work, and its tick. When every row is ticked, the review sets **Reviewed** in `VERSIONS.md` and this issue closes on the next watch run.", "",
    ...rows].join("\n");
}

async function notify(due, reviews, rows) {
  if (!token) throw new Error("--notify needs a token: set GH_TOKEN or GITHUB_TOKEN, or log in with gh");
  const labels = await api(`repos/${OURS}/labels?per_page=100`);
  if (!labels.some((l) => l.name === LABEL)) {
    await api(`repos/${OURS}/labels`, { method: "POST", body: { name: LABEL, color: "0052cc", description: "A Foundry or dnd5e release to judge across the family" } });
  }
  const open = await api(`repos/${OURS}/issues?state=open&labels=${encodeURIComponent(LABEL)}&per_page=100`);
  const errataOpen = await api(`repos/${ERRATA}/issues?state=open&labels=${encodeURIComponent("version review")}&per_page=100`).catch(() => []);
  const log = [];
  for (const [pkg, r] of Object.entries(rows)) {
    const prefix = `Upgrade review: ${r.Name} `;
    const mine = open.filter((i) => i.title.startsWith(prefix));
    const d = due.find((x) => x.pkg === pkg);
    if (d) {
      const title = `${prefix}${r.Reviewed} → ${d.latest.version}`;
      if (mine.some((i) => i.title === title)) continue;
      if (mine.length) {
        // A newer release while the review is open: keep the ticked rows, retitle, say so.
        await api(`repos/${OURS}/issues/${mine[0].number}`, { method: "PATCH", body: { title } });
        await api(`repos/${OURS}/issues/${mine[0].number}/comments`, { method: "POST",
          body: { body: `${r.Name} ${d.latest.version} is out too (${d.latest.date}). Its notes and leads: [${reviews[pkg].file}](https://github.com/${OURS}/blob/main/${reviews[pkg].file}). Re-judge the rows it touches.` } });
        log.push(`retitled #${mine[0].number}: ${title}`);
      } else {
        const errataIssue = errataOpen.find((i) => i.title.includes(r.Name.split(" ")[0]))?.number;
        const created = await api(`repos/${OURS}/issues`, { method: "POST", body: { title, body: issueBody(pkg, r.Name, r.Reviewed, d.latest, reviews[pkg], errataIssue), labels: [LABEL] } });
        log.push(`opened #${created.number}: ${title}`);
      }
      await sleep(3000);
    } else {
      for (const i of mine) {
        // Reviewed moved, but the issue closes only with every repo judged.
        const open = (i.body?.match(/^- \[ \] /gm) ?? []).length;
        if (open) { log.push(`kept #${i.number} open: Reviewed is ${r.Reviewed} but ${open} row(s) have no verdict`); continue; }
        await api(`repos/${OURS}/issues/${i.number}/comments`, { method: "POST", body: { body: `Reviewed: VERSIONS.md now says ${r.Reviewed} (${today}).` } });
        await api(`repos/${OURS}/issues/${i.number}`, { method: "PATCH", body: { state: "closed", state_reason: "completed" } });
        log.push(`closed #${i.number}: ${r.Name} reviewed at ${r.Reviewed}`);
        await sleep(3000);
      }
    }
  }
  return log;
}

/* -------------------------------------------- */
/*  Run                                         */
/* -------------------------------------------- */

async function main() {
  const { text, rows } = readVersions();
  const upstream = { foundry: await foundryReleases(), dnd5e: await dnd5eReleases() };
  const due = [], reviews = {}, newVersions = [];
  for (const [pkg, all] of Object.entries(upstream)) {
    const r = rows[pkg];
    if (!r) throw new Error(`VERSIONS.md has no ${pkg} row`);
    const stable = all.filter((x) => x.channel === "stable");
    const latest = stable[0];
    if (!r["Latest published"] || cmpVersion(latest.version, r["Latest published"]) > 0) {
      newVersions.push(`${pkg} ${r["Latest published"] ?? "—"} -> ${latest.version}`);
      r["Latest published"] = latest.version;
      r["First seen"] = today;
    }
    const pre = all.find((x) => x.channel !== "stable" && cmpVersion(x.version, latest.version) > 0);
    r["Newest pre-release"] = pre ? `${pre.version} (${pre.channel}, ${pre.date})` : null;
    if (r.Reviewed && cmpVersion(latest.version, r.Reviewed) > 0) {
      const pending = stable.filter((x) => cmpVersion(x.version, r.Reviewed) > 0);
      reviews[pkg] = await buildReview(pkg, r.Name, r.Reviewed, pending, all);
      due.push({ pkg, latest, pending });
    }
  }
  writeVersions(text, rows);
  const notified = NOTIFY ? await notify(due, reviews, rows) : [];
  const summary = { date: today, newVersions, due: due.map((d) => `${d.pkg} ${rows[d.pkg].Reviewed} -> ${d.latest.version}`), notified };

  const logText = existsSync(LOG) ? readFileSync(LOG, "utf8") : "# Upstream watch log\n\nOne row per run (`tools/upstream-watch.mjs`).\n\n| Date | New versions | Reviews due | Issues |\n| --- | --- | --- | --- |\n";
  const row = `| ${today} | ${newVersions.join("; ") || "none"} | ${summary.due.join("; ") || "none"} | ${notified.join("; ") || "—"} |`;
  const lines = logText.replace(/\r\n/g, "\n").trimEnd().split("\n").filter((l) => !l.startsWith(`| ${today} |`));
  writeFileSync(LOG, `${[...lines, row].join("\n")}\n`);

  const out = flag("--summary");
  if (out) writeFileSync(out, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`[upstream-watch] new: ${summary.newVersions.join(", ") || "none"}; due: ${summary.due.join(", ") || "none"}${notified.length ? `; ${notified.join("; ")}` : ""}`);
}

main().catch((err) => { console.error(`upstream-watch: ${err.message}`); process.exit(1); });
