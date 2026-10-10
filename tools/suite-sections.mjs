#!/usr/bin/env node
// suite-sections.mjs - the "Part of Open Roll 5e" section of every sibling README, and the catalogue
// in this repo's README, written from repos.json so the lines stay identical across repos.
//
//   node tools/suite-sections.mjs          rewrite every section that is out of date
//   node tools/suite-sections.mjs --check  report what is out of date and exit 1 if anything is
//
// A README takes part by carrying a marker pair; everything between the markers is replaced:
//   <!-- openroll5e:family -->    ...   <!-- /openroll5e:family -->     in a module or server README
//   <!-- openroll5e:catalogue --> ...   <!-- /openroll5e:catalogue -->  in this repo's README
// A repo counts when it is active, public and has a "blurb" in repos.json. Run this after adding,
// renaming or retiring a repo, then commit each README in its own repo.
//
// Line endings are not content. A README is up to date when it matches with CRLF read as LF, and a
// rewrite renders the section in the ending the file already uses (a Windows checkout under
// core.autocrlf holds CRLF), so neither mode ever touches a tree over endings alone.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

const manifest = JSON.parse(readFileSync(join(ROOT, "repos.json"), "utf8"));
const owner = manifest.owner;
const listed = manifest.repos.filter((r) => r.status === "active" && r.visibility === "public" && r.blurb);
const mods = listed.filter((r) => r.kind === "mod");
const mcps = listed.filter((r) => r.kind === "mcp");

const url = (r) => `https://github.com/${owner}/${r.name}`;
const label = (r) => r.title || r.name;
const short = (r) => label(r).replace(/^Open Roll 5e: /, "");
const line = (r) => `- [${label(r)}](${url(r)}): ${r.blurb}`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const suiteLink = `[fvtt-suite-openroll5e](https://github.com/${owner}/fvtt-suite-openroll5e)`;

function familySection(self) {
  const out = ["## Part of Open Roll 5e", ""];
  if (self.kind === "mod") {
    out.push(
      `${short(self)} is one of the Open Roll 5e modules for Foundry VTT, a suite built for one D&D 5e table and`,
      "shared. Each module installs and works on its own and none needs another; together they cover the",
      "table from the fog of war to the loot. The other modules:",
      "",
      ...mods.filter((r) => r !== self).map(line),
      "",
      "Three MCP servers for [Claude Code](https://claude.com/claude-code) complete the suite:",
      "",
      ...mcps.map(line),
    );
  } else {
    out.push(
      `${self.name} is one of the three MCP servers in Open Roll 5e, a suite of Foundry VTT modules and Claude`,
      "Code tooling built for one D&D 5e table and shared. The other servers:",
      "",
      ...mcps.filter((r) => r !== self).map(line),
      "",
      "The modules, each of which installs and works on its own and none of which needs another:",
      "",
      ...mods.map(line),
    );
  }
  out.push(
    "",
    "Issues are welcome on every repo in the family; pull requests are not accepted, since each is one",
    `author's design for one table, shared because it might suit yours. How they fit together is mapped in ${suiteLink}.`,
  );
  return out.join("\n");
}

function catalogue() {
  return [
    "## The modules",
    "",
    "| Module | Does |",
    "| --- | --- |",
    ...mods.map((r) => `| [${label(r)}](${url(r)}) | ${cap(r.blurb)} |`),
    "",
    "## The MCP servers",
    "",
    ...mcps.map((r) => `- [${r.name}](${url(r)}): ${r.blurb}`),
  ].join("\n");
}

const toLF = (text) => text.replace(/\r\n/g, "\n");

// The line ending a file mostly uses; a tie, or a file with no newline, counts as LF.
function eolOf(text) {
  const crlf = (text.match(/\r\n/g) || []).length;
  const lf = (text.match(/\n/g) || []).length - crlf;
  return crlf > lf ? "\r\n" : "\n";
}

// The section rendered in `eol`, in place of whatever sits between the markers; null when the
// README carries no markers for `tag`.
function replaceBlock(text, tag, body, eol) {
  const re = new RegExp(`<!-- openroll5e:${tag} -->[\\s\\S]*?<!-- /openroll5e:${tag} -->`);
  if (!re.test(text)) return null;
  const block = [`<!-- openroll5e:${tag} -->`, body, `<!-- /openroll5e:${tag} -->`].join("\n");
  return text.replace(re, () => block.replace(/\n/g, eol));
}

const targets = [
  ...listed.map((r) => ({ file: join(ROOT, r.name, "README.md"), tag: "family", body: familySection(r), name: r.name })),
  { file: join(ROOT, "README.md"), tag: "catalogue", body: catalogue(), name: "fvtt-suite-openroll5e" },
];

let stale = 0;
for (const t of targets) {
  if (!existsSync(t.file)) {
    console.log(`${t.name.padEnd(26)} not cloned; skipped`);
    continue;
  }
  const before = readFileSync(t.file, "utf8");
  const after = replaceBlock(before, t.tag, t.body, eolOf(before));
  if (after === null) {
    console.log(`${t.name.padEnd(26)} README has no openroll5e:${t.tag} markers; skipped`);
    continue;
  }
  if (toLF(after) === toLF(before)) {
    console.log(`${t.name.padEnd(26)} up to date`);
    continue;
  }
  stale++;
  if (CHECK) {
    console.log(`${t.name.padEnd(26)} OUT OF DATE`);
  } else {
    writeFileSync(t.file, after);
    console.log(`${t.name.padEnd(26)} written`);
  }
}
if (CHECK && stale) process.exit(1);
