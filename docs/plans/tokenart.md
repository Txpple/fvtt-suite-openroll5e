# Plan — Token Art, a new Open Roll 5e module

**BUILT AND RELEASED 2026-10-15** as `fvtt-mod-tokenart` 1.0.0 (tag `v1.0.0`, the zip and `module.json` on the release),
walked on the sandbox (all twelve steps green) and installed on prod through the installer the same day. The walk changed
four things, recorded in the module's CLAUDE.md: decisions read the stored image, Rescan rides a world setting, a stored look
is recognised by its name, Restore All pauses the whole world. Drafted 2026-10-15 from the brief ("a graphics token enhancer": one token image per state, found by file name, base as
the fallback) and the family as it stands: Combat Plus 1.7.0 (defeated marking at 0 HP on the active GM's client), By the
Books 3.4.7 (Summon Art's `<stem>.<ext>` / `<stem>-portrait.<ext>` naming in `scripts/decide/summon-art.js`, the leading-window
election in `scripts/core.js`, the dynamic-ring note), the dnd5e MCP's house token defaults (ring off, wildcard art off) and
imagegen's token redress and cutout. Nothing here is built. The decisions it needed are at the end, taken the same day.

## The brief, as contours

| # | The brief | What it asks of the module |
| --- | --- | --- |
| C1 | "base will be the default token used in art work" | the token's own `texture.src`, as placed; nothing to configure; the floor every other look falls to |
| C2 | "ready will be the token in any normal state" | worn whenever no other look applies, if its file exists |
| C3 | "combat: switch an actor to this token if placed in combat, remove if off" | a combatant in a combat wears it; removed from the tracker or the combat deleted, it comes off |
| C4 | "prone if the token has prone condition, remove if off" | the actor's `prone` status (an ActiveEffect with that status, dnd5e's own condition) |
| C5 | "dead if the token is below 0 hps, remove if off" | hit points at 0 (dnd5e floors at 0, so "below" is "at"), or the `dead` status; healed above 0 and the status gone, it comes off |
| C6 | "if there is no setting for 2-6, it falls back to base" | a look with no file is not an error; the token wears what it has (D2 below: which, when several apply) |
| C7 | "naming convention of the files, so we don't have lots of folder subfolders" | the looks sit beside the base in the same folder, told apart by a suffix; no configuration, no table, no folder scan |

## The name

**`fvtt-mod-tokenart`, title `Open Roll 5e: Token Art`**, package id = repo name (the family's rule; the name part has
no hyphens). First pass on foundryvtt.com (2026-10-15): the package pages `token-art`, `tokenart`, `token-faces`,
`token-states` and `token-looks` are all 404. The one neighbour is **Token Variant Art** (`token-variants`, Aedif): it maps
art to status effects, visibility and combat state too, with folder search paths, roll tables, Imgur and S3 sources, a HUD
picker and per-user images. It is the configurable, general tool; Token Art is the opposite bet, a naming convention and
nothing to set up, which is the family's way (Area Sounds against the playlist modules, Loot Shelf against the shop
modules). Not the same title, so no clash on this pass. **The definitive check is the setup screen's `getPackages` with no
world active** (CLAUDE.md, *Names*); it is the step right before `gh repo create`. Fallbacks if it finds a clash: Token
Looks, Token Faces.

In the module's own words the five images are **looks**: the base look and the ready, combat, prone and dead looks.

## The convention

- **The base** is whatever the token wears when nothing applies: `assets/tokens/goblin.webp`. The module never writes it,
  never needs it named, and never touches the prototype token.
- **The looks** are the same name with a suffix before the extension, in the same folder, with the same extension:
  `goblin-ready.webp`, `goblin-combat.webp`, `goblin-prone.webp`, `goblin-dead.webp`. The separator is `-`, the one By
  the Books' `fileStem` writes and its Summon Art already reads (`giant-owl.webp` the token, `giant-owl-portrait.webp` the
  portrait), so a creature's folder reads as one family of names: `giant-owl.webp`, `giant-owl-portrait.webp`,
  `giant-owl-dead.webp`. A world setting offers `_` and `.` for art packs that name differently.
- **Derivation is one way**, base → looks. The module never reads a base out of a look's name: a token placed with
  `walking-dead.webp` has the base `walking-dead.webp` and the looks `walking-dead-dead.webp` and so on. The one nuance:
  a texture change that lands on one of the *current base's own* look paths is recognised as a look, not adopted as a new
  base (why this matters: By the Books' companion and transform snapshots store `_source.texture.src` and restore it, so a
  familiar snapshotted while prone would otherwise hand its prone look back as its base).
- **Wildcard tokens.** A prototype with `randomImg` and `goblin-*.webp` would draw `goblin-dead.webp` as a random image.
  The module wraps `Actor.prototype.getTokenImages` to drop any file ending in a look suffix, deferring to the original (a
  manual wrap, no libWrapper, as the family does its Token-class patches). The house keeps `randomImg` off anyway (the
  MCP's `token-defaults.ts`), so this is correctness for other tables, not the main path.
- **Dynamic rings.** With `ring.enabled` and a `ring.subject.texture` set, the subject path gets the same suffix and both
  fields swap together; with the subject blank, Foundry draws the subject from `texture.src` and that alone is written. The
  house turns rings off (the MCP's defaults; Summon Art's landing), so again an edge, not the road.
- Video textures (`.webm`) follow the same rule. A query string (`?...`, a Forge URL) is split off before the extension and
  put back after.

## Which look wins

`dead` > `prone` > `combat` > `ready` > base. A dead creature is dead whatever else is true; a prone combatant is prone;
a combatant is in combat; anything else at rest is ready. **What a missing file does is D2:** the brief says base; the plan
recommends falling through to the next look that applies *and exists*, with base the floor, so a creature that has only a
ready look keeps it through a fight instead of flipping to base on the tracker's first row and back on its last.

## Who acts, and when

- **The active GM's client** (`game.users.activeGM?.isSelf`, as Combat Plus's defeated marking). The write is idempotent,
  every client computes the same look and the same path, so two GM windows (suite issue #8) land the same update twice
  and the second is a no-op diff; By the Books' leading-window flag is not needed here. The active GM may be the bridge's
  headless client (Assistant DM): the module needs no canvas, everything is document-level, so that is fine, as it already
  is for Combat Plus.
- **Document hooks, not canvas hooks**, so tokens on scenes nobody is viewing follow too:
  `createToken` (resolve the looks, apply); `updateToken` with `texture.src` changed and not by the module (adopt the new
  base, re-resolve, apply: this is how Token Config edits, dnd5e transforms, Wild Shape Art, Summon Art's landing and the
  MCP's `set-actor-art` all become the base); `updateActor` with `system.attributes.hp.value` in the change (C5);
  `createActiveEffect` / `deleteActiveEffect` / `updateActiveEffect` whose `statuses` meet `prone` or `dead`, or whose
  `disabled` flips (C4, C5); `createCombatant` / `deleteCombatant` / `deleteCombat` (C3; D3 says whether `combatStart`
  joins them); `ready` (reconcile every token on every scene once, cheaply: flags and the probe cache).
- **An actor's tokens**: linked, every token on every scene with that `actorId` and `actorLink`; unlinked, the one token
  behind the synthetic actor (`actor.token`), Combat Plus's own match. Several tokens on one scene go up in one
  `scene.updateEmbeddedDocuments("Token", …)`.
- **The module's own writes** carry a marker option (`{ tokenart: true }`) and the flag in the same update, with flat keys
  (`"texture.src"`: By the Books measured a nested `texture` object leaving the prepared texture stale on 14.369). Two
  flags on the token, both the module's: `base` (the path to return to) and `look` (the one worn now, absent at base).
  Nothing is written on the actor or the prototype.

## Resolving which looks exist

- Per unique base path, once per GM session: `foundry.utils.srcExists` (a HEAD request) on each of the four look paths,
  cached in memory on the GM client, misses included. A token with no looks costs four requests once and nothing after.
  `srcExists` is source-agnostic (Foundry's data folder, Molten, the Forge, S3) and needs no permission.
- Considered and parked: one `FilePicker.browse` per folder. Cheaper for hundreds of distinct bases, but it needs the
  browse permission and a source (data / forgevtt / s3) worked out from the path. Revisit if a table's scenes carry that
  many creatures.
- A **Rescan token art** button in settings (and `api.rescan()`) empties the cache and reconciles; a reload does the same.
  New art uploaded mid-session is one click away, and the README says so.

## Settings (world scope, few)

- Four switches, one per look (`Ready look`, `Combat look`, `Prone look`, `Dead look`), all on: each chore behind its own
  setting, Combat Plus's shape.
- `Suffix separator`: `-` (default), `_`, `.`.
- The D1 and D3 switches below, if the user wants them as settings rather than rules.
- Two buttons: **Rescan token art**, **Restore every token to its base** (the step before disabling or uninstalling, since
  Foundry has no disable hook; also `api.restoreAll()`).

## API and hooks

- `game.modules.get("fvtt-mod-tokenart").api`: `looksFor(tokenDoc)` (the five paths and which exist), `apply(tokenDoc)`,
  `rescan()`, `restoreAll()`.
- One hook, `tokenart.changed` with `(tokenDoc, { from, to, look })`, fired on every client from `updateToken` when the
  marker is present, so a listener on any client hears it. Named by the contract (`<short>.<event>` for `fvtt-mod-<short>`),
  documented in the README, and every listener tolerates it never firing.

## The family

- **Combat Plus**: its defeated marking stamps `dead` and the tracker's defeated mark at 0 HP; Token Art reads the same
  signals and needs neither. The skull overlay still draws over the dead look; a table with dead art may turn Combat Plus's
  overlay off, in settings, not code. Both install alone.
- **By the Books**: Summon Art and Wild Shape Art write textures, Battle Familiar's empower transforms and reverts; all
  of it is adopted as a base change (and a snapshot that hands back a look path is recognised, above). By the Books could
  one day read `flags.fvtt-mod-tokenart.base` when Token Art is active to snapshot the base rather than the worn look; a
  detection, never a requirement, and not needed for 1.0.
- **FX Studio**: free to listen to `tokenart.changed` for a puff of smoke on a swap, through a reader in `scripts/readers/`.
  Later, if wanted.
- **imagegen**: the art pipeline. `edit-image` on the base token ("the same goblin lying prone", "dead, eyes closed, weapon
  dropped", "weapon drawn, snarling"), re-cut automatically, saved under the convention's names; `upload-asset` carries them
  up beside the base. An imagegen tool that makes the four looks from one base in a call is a follow-up of its own.
- **The dnd5e MCP**: `set-actor-art` writes the base, nothing more to teach it. `find-asset-references` and `content-audit`
  will not see a look file as referenced until a token wears it, so the audit would call the looks orphans: a small MCP
  follow-up, a `-<look>` sibling of a referenced base counts as referenced. `src/page/world.ts` stays as it is: no MCP tool
  writes Token Art's data, so the bridge block has nothing to report.
- Errata, Session Scribe, Area Sounds, Loot Shelf, Party Stash, Open Server, Autoexplore: nothing.

## The repo

- `gh repo create Txpple/fvtt-mod-tokenart --public`, MIT, issues on, pull requests not accepted
  (`.github/PULL_REQUEST_TEMPLATE.md` copied from Combat Plus).
- `module.json`: id `fvtt-mod-tokenart`, title `Open Roll 5e: Token Art`, compatibility minimum 13 verified 14 (Combat Plus
  and Autoexplore's), esmodule `scripts/tokenart.js`, the system relationship as By the Books declares it (the hit-point
  path is dnd5e's; the statuses are core), manifest and download URLs in the family's release shape.
- `scripts/tokenart.js`: settings, the hooks, the probe cache, the writer, the `getTokenImages` wrap, the API.
  `scripts/decide/looks.js`, pure and tested: `lookPaths(base, separator)`, `isLookOf(path, base, separator)`,
  `stateOf({ hp, statuses, inCombat })`, `winningLook(state, available, policy)` (the D2 chain), the query-string split.
  **Tooling from day one**: Biome and Vitest copied from By the Books (the convention when a small module grows tooling),
  `tests/` for `decide/`, `npm run verify`. The naming rule and the precedence are exactly what unit tests catch.
- `README.md` with the `<!-- openroll5e:family -->` markers (the section is generated, never hand-edited), the convention
  table with an example folder listing, the settings, the API and the hook; `CLAUDE.md` with one dated State block.
- Release by hand like the other small modules (one GitHub release per version, `module.json` and
  `fvtt-mod-tokenart.zip` both attached); By the Books' `release.yml` can be copied once the shape settles.
- **Suite steps** (CLAUDE.md, *Working here*): the `repos.json` entry with the blurb below; `node tools/suite-sections.mjs`
  (rewrites the twelve sibling READMEs and the catalogue; each committed in its repo); `node tools/integration-map.mjs`;
  `node tools/upstream-surface.mjs`; a row in CLAUDE.md's family table and a line under *How they fit together*.
  `sync.ps1` clones it from `repos.json` on the next machine.
  Blurb draft: *gives every token the look of its state, ready, in combat, prone or dead, each a file named beside the
  base art, with nothing to configure.*
- **Deploy**: the sandbox with `deploy-house-module.mjs fvtt-mod-tokenart --local` from the MCP repo during the build;
  prod only after the first release, and a new module goes in through `/setup`'s `installPackage` (the Molten gotcha
  memory), not a world bounce; then `configure-modules.mjs --enable`.

## The walk on the sandbox (acceptance, each a line in the module's tools README)

1. A BTB test actor whose token is `x.webp` with four looks uploaded beside it (imagegen redresses, or tinted copies for
   the first walk). Placed: the ready look.
2. Added to the tracker: combat. Removed: ready. Combat deleted with it inside: ready.
3. Prone applied (`apply-condition`): prone, in and out of combat. Removed in combat: combat.
4. Hit points to 0: dead, under Combat Plus's skull. Healed: whatever applies.
5. The `-combat` file deleted and Rescan pressed: a combatant falls through to ready (D2).
6. The texture changed by hand in Token Config: adopted as the base, its looks re-derived.
7. A druid Wild Shaped (By the Books' Wild Shape Art): the form's art adopted; reverted: the druid's base and looks back.
8. A second GM window open: no flicker, one visible swap.
9. A wildcard prototype `goblin-*.webp` with `goblin-1-dead.webp` present: ten placements never pick a look file.
10. A player's client: the swaps show, no permission errors, no probe requests in its network log.
11. A linked character on an unviewed scene at 0 HP: dead there too, seen on switching to it.
12. Restore all, then the module disabled: every token at its base.

## Decisions

**Taken 2026-10-15: all four as recommended** (the user, "accept recos, go"). The build follows the bold choices.

- **D1. Characters at 0 Hit Points.** A character at 0 HP is Unconscious by the book, not Dead; dnd5e's downed conditions
  (set to *all* on prod) press Unconscious on a PC and Dead on an NPC. The brief says dead below 0 HP for everyone.
  Recommend: **one rule for all** (0 HP or the Dead status wears the dead look); a separate `down` look for a dying PC is one
  more word in the list if the table wants it later.
- **D2. A missing look.** The brief: fall back to base. Recommend: **fall through** to the next look that applies and exists
  (dead → prone → combat → ready → base), so a creature with only a ready look keeps it in combat.
- **D3. When combat begins for a token.** Recommend: **when it is added to the tracker** (the brief's "placed in combat"); the
  alternative is the combat's start (round 1), which would leave a token at ready through initiative.
- **D4. The name.** Token Art, pending the setup-screen check; Token Looks or Token Faces if it clashes.

## Out of scope, kept for later

More looks (`down`, `hidden`, `concentrating`, per-condition art as Token Variant Art does: each is one more word and one
more place in the chain); a Token Config tab listing the five looks found and missing; the imagegen tool that makes the
four looks from a base; FX Studio's puff on `tokenart.changed`; the MCP audit recognising look files.
