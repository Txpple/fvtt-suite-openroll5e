#!/usr/bin/env node
// build-module-zip.mjs - the release zip of one family module, written and read back.
//
//   node tools/build-module-zip.mjs <module dir>                    build <module dir>/dist/<id>.zip
//   node tools/build-module-zip.mjs <module dir> --tag v1.2.3       and refuse unless the tag is
//                                                                   module.json's version
//   node tools/build-module-zip.mjs <module dir> --out <zip>        write the zip there instead
//   node tools/build-module-zip.mjs <module dir> --include <folder> also pack a served folder the
//                                                                   defaults do not name (repeatable)
//
// The family's reusable release workflow (.github/workflows/release-module.yml) runs it on a pushed
// tag and publishes what it builds; run by hand it is the dry run. By the Books keeps its own
// builder (its gate and its battery line), from which this one is generalized.
//
// What ships: module.json, LICENSE and README.md when present, and every file under the served
// folders: scripts/, styles/, templates/, lang/, plus the top folder of every path module.json
// names (esmodules, scripts, styles, languages, packs) and any --include. Nothing else: no tests,
// tools, docs or dotfiles.
//
// The manifest is checked first: its download URL names v<version> and ends <id>.zip, its manifest
// URL is the releases/latest/download/module.json the family installs from, and every path it names
// is in the archive. A text file with CRLF line endings is refused: a checkout that drifted would
// ship other bytes than CI's (each module's .gitattributes keeps checkouts LF).
//
// The zip is written here, not by a shell tool: PowerShell's Compress-Archive writes backslash
// separators, and Foundry's extractor then installs the module as an empty shell. Entries are
// stored with forward slashes and a fixed timestamp, so one commit gives the same bytes on every
// machine. The read-back proves what ships: no backslash entry, nothing missing or extra, every
// entry inflating to the tree's own bytes, and every relative import inside a packed script
// resolving to another entry.
//
// Under GitHub Actions it writes zip=, version= and prerelease= (a version with a pre-release
// suffix, 1.2.0-beta.1, is a pre-release) to GITHUB_OUTPUT for the publish step.

import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import { crc32, deflateRawSync, inflateRawSync } from "node:zlib";

const fail = (msg) => {
  console.error(`build-module-zip: ${msg}`);
  process.exit(1);
};

const args = process.argv.slice(2);
const flag = (name) => {
  const at = args.indexOf(name);
  if (at < 0) return null;
  const value = args[at + 1];
  if (!value || value.startsWith("--")) fail(`${name} needs a value`);
  return value;
};
const all = (name) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : [])).filter(Boolean);
const positional = args.filter((a, i) => !a.startsWith("--") && !["--tag", "--out", "--include"].includes(args[i - 1]));
if (positional.length !== 1) fail("give exactly one module directory: node tools/build-module-zip.mjs <module dir>");

const MOD = resolve(positional[0]);
const tag = flag("--tag");
if (!existsSync(join(MOD, "module.json"))) fail(`no module.json in ${MOD}`);

const manifest = JSON.parse(readFileSync(join(MOD, "module.json"), "utf8"));
const { id, version } = manifest;
if (!id || !version) fail("module.json has no id or version");
const OUT = resolve(flag("--out") ?? join(MOD, "dist", `${id}.zip`));

// The manifest's own promises.
if (tag && tag !== `v${version}`) fail(`the tag is ${tag} but module.json says ${version}`);
if (!String(manifest.download ?? "").includes(`/v${version}/`)) fail(`module.json's download URL does not name v${version}`);
if (!String(manifest.download ?? "").endsWith(`/${id}.zip`)) fail(`module.json's download URL does not end /${id}.zip`);
if (!/\/releases\/latest\/download\/module\.json$/.test(String(manifest.manifest ?? ""))) {
  fail("module.json's manifest URL is not .../releases/latest/download/module.json");
}

/** Every path module.json names, as forward-slash paths relative to the module. */
const named = [
  ...(manifest.esmodules ?? []),
  ...(manifest.scripts ?? []),
  ...(manifest.styles ?? []),
  ...(manifest.languages ?? []).map((l) => l?.path),
  ...(manifest.packs ?? []).map((p) => p?.path),
].filter((p) => typeof p === "string" && p).map((p) => p.replace(/\\/g, "/").replace(/^\.?\//, ""));

const SERVED = new Set(["scripts", "styles", "templates", "lang", ...all("--include")]);
for (const p of named) if (p.includes("/")) SERVED.add(p.split("/")[0]);

/** Every file under `dir`, recursively, as a forward-slash path from the module root; dotfiles skipped. */
function filesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...filesUnder(full));
    else out.push(relative(MOD, full).split("\\").join("/"));
  }
  return out;
}

const names = ["module.json"];
for (const top of ["LICENSE", "README.md"]) if (existsSync(join(MOD, top))) names.push(top);
for (const folder of [...SERVED].sort()) {
  const dir = join(MOD, folder);
  if (existsSync(dir) && statSync(dir).isDirectory()) names.push(...filesUnder(dir));
}
for (const p of named) {
  if (!names.includes(p) && !names.some((n) => n.startsWith(`${p}/`))) fail(`module.json names ${p}, which is not in the tree`);
}

const files = new Map(names.map((n) => [n, readFileSync(join(MOD, n))]));
const TEXT = /\.(js|mjs|css|hbs|html|json|md|txt|svg|yml|yaml)$|^LICENSE$/;
const crlf = [...files].filter(([n, data]) => TEXT.test(n) && data.includes("\r\n")).map(([n]) => n);
if (crlf.length) fail(`CRLF line endings in ${crlf.join(", ")} - check them out again (the repo's .gitattributes keeps them LF)`);

// 1980-01-01 00:00, the earliest DOS time.
const DOS_TIME = 0;
const DOS_DATE = (0 << 9) | (1 << 5) | 1;

/** A zip archive of `entries` (name -> bytes), every entry deflated. */
function writeZip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const nameBytes = Buffer.from(name, "utf8");
    const packed = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBytes, packed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(DOS_TIME, 12);
    central.writeUInt16LE(DOS_DATE, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBytes);
    offset += local.length + nameBytes.length + packed.length;
  }
  const dir = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.size, 8);
  end.writeUInt16LE(entries.size, 10);
  end.writeUInt32LE(dir.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, dir, end]);
}

/** Read a zip back through its central directory: name -> inflated bytes, CRC checked. */
function readZip(buf) {
  const endAt = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (endAt < 0) fail("the archive has no end-of-central-directory record");
  const count = buf.readUInt16LE(endAt + 10);
  let at = buf.readUInt32LE(endAt + 16);
  const out = new Map();
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(at) !== 0x02014b50) fail(`central directory entry ${i} is malformed`);
    const method = buf.readUInt16LE(at + 10);
    const crc = buf.readUInt32LE(at + 16);
    const size = buf.readUInt32LE(at + 20);
    const nameLen = buf.readUInt16LE(at + 28);
    const extraLen = buf.readUInt16LE(at + 30);
    const commentLen = buf.readUInt16LE(at + 32);
    const localAt = buf.readUInt32LE(at + 42);
    const name = buf.toString("utf8", at + 46, at + 46 + nameLen);
    const dataAt = localAt + 30 + buf.readUInt16LE(localAt + 26) + buf.readUInt16LE(localAt + 28);
    const raw = buf.subarray(dataAt, dataAt + size);
    const data = method === 8 ? inflateRawSync(raw) : Buffer.from(raw);
    if (crc32(data) !== crc) fail(`${name}: CRC mismatch`);
    out.set(name, data);
    at += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

const zip = writeZip(files);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, zip);

const back = readZip(readFileSync(OUT));
const problems = [];
for (const name of back.keys()) if (name.includes("\\")) problems.push(`backslash separator: ${name}`);
for (const name of names) {
  if (!back.has(name)) problems.push(`missing from the archive: ${name}`);
  else if (!back.get(name).equals(files.get(name))) problems.push(`differs from the tree: ${name}`);
}
if (back.size !== names.length) problems.push(`${back.size} entries, expected ${names.length}`);
let imports = 0;
for (const [name, data] of back) {
  if (!/\.m?js$/.test(name)) continue;
  // Comments are not code: a usage example in a header names files the module never imports.
  const code = data.toString("utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  for (const m of code.matchAll(/(?:from\s+|import\s*\(?\s*)["'](\.[^"']+)["']/g)) {
    imports++;
    const target = posix.normalize(posix.join(posix.dirname(name), m[1]));
    if (!back.has(target)) problems.push(`import resolves to nothing in the archive: ${name} -> ${target}`);
  }
}
if (problems.length) fail(`do not ship this archive:\n  ${problems.join("\n  ")}`);

const prerelease = /-/.test(version);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `zip=${OUT}\nversion=${version}\nprerelease=${prerelease}\n`);
}
console.log(`${id} v${version}${prerelease ? " (pre-release)" : ""} -> ${relative(process.cwd(), OUT).split("\\").join("/") || OUT}`);
console.log(`${zip.length.toLocaleString("en-US")} bytes, ${back.size} entries, ${imports} relative imports resolved, every entry equal to the tree`);
