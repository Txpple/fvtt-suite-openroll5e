# Plan — Crystal Ball, a new Open Roll 5e module

**PHASE 1 BUILT the night of 2026-11-01 to 02** as `fvtt-mod-crystalball` 0.1.0 on `main` (local only, not on
GitHub, unreleased, not on prod), deployed to the sandbox and walked there by its `tools/live-check.mjs --walk`
(GREEN: the module and its six settings registered, the button after Clue Board's, the dark state, the socket's
session id equal to the browser's cookie, a temporary player owning Kartor asking the ball about the Lamp of 1391
and the Seer's stub sentence naming Kartor Bloodaxe (Paladin 2), 23 shared pages, 31 clues and 4 members, the
count moving, New sitting). `npm run verify` green (312 tests across both halves). Two Opus builders built the
halves to `docs/seer-contract.md` in the repo; three Opus reviews (the window, the Seer, Linux portability) ran
and every finding was applied. **What the build changed from the plan below:** the ball's socket cookie is HttpOnly
on 14.369, so the window sends the id Foundry's own socket holds; the probe is asked on every request (a session
id is rebound to whoever logs in next on that browser); a call counts the moment the model is asked, however it
ends; the join needs `getJoinData` on a fresh cookie and Foundry's own `Origin`; no `host.js` (the window opens
nothing, and the copied helper pulled sheets into a detached ball); the sandbox's Service URL carries the
`/crystalball` path; the lore measured ≈ 37k tokens, not 12–16k, because the Bestiary and the four backstories are
player-observable on this world (ownership decides the lore). **The morning of the 2nd:** the key in
`seer/.env`, nine real calls on Opus from the DM's login and a player's (the DM's first wrote 90k tokens to the
cache and each later one read it for about three cents; the player's first read the shared layers and wrote only
his own 8k), then effort medium and instructions version 2 (the ball may make suggestions, grounded and marked as
its own). The name checked free and the GitHub repo made the same
morning (`sync` on, every family section carrying it). Released as 1.0.0 and on prod the same day, the
Seer as a systemd unit on the box and the tunnel's route from the dashboard. **Owed:** the ownership of the
Bestiary on prod if it is not meant to be read.

Drafted 2026-11-01 from the brief ("a new module that works like clueboard, sort of ... a button in the side menu
with a crystal ball icon, immediately after clueboard ... a chat box ... a window to talk to an API enabled claude
model ... anything in journal the char can see, their own char including inventory, and their group ... clues are
also in scope ... cost effective, caching context where possible ... sonnet or opus, no haiku ... 20-40 messages
from players per month ... a node process that listens and handles the queries through the server, NOT clients ...
an always on assistant gm level bot, managed by the server ... test on local sandbox (windows), deploy on linux
(prod)"). The decisions it needs are at the end, the open ones marked. The numbers in *Halruaa, measured* were
read off the sandbox and Foundry 14.369's own code today.

**Ruled the same evening** (the user, after the pros and cons of a headless-Chromium GM bot were laid out: "socket it
for now"): the Seer is a raw socket client and the ball's user a Player (D3, D4 ruled). The resident GM page, which
would let players trade with Loot Shelf merchants and let By the Books' steps land while the DM is away, is a task
of its own with its own plan, decided on its own merits; the ball does not wait for it. The build started that
night on the sandbox, in `fvtt-mod-crystalball` (scaffolded from the template; the binding contract between the
two halves is its `docs/seer-contract.md`), with the Linux deployment carried as examples and a portability review,
since no Linux test box exists.

## The brief, as contours

| # | The brief | What it asks of the module |
| --- | --- | --- |
| C1 | "works like clueboard, sort of ... a new button in the side menu ... crystal ball icon, immediately after clueboard" | a button on the sidebar's strip after Clue Board's spy (Clue Board's rule: a button, never a sidebar tab), a window of its own in Card Catalogue's look |
| C2 | "a window that is a chat box ... a window to talk to an API enabled claude model" | a transcript and an input; the answer streams in; a conversation a player can start over |
| C3 | "anything in journal the char can see, their own char including inventory/char sheet, and their group (all owned, so filter on isowned for actors)" and "clues are also in scope" | the ball knows exactly what the player's own client would show them: the journal pages they can observe, the characters they own, the party they belong to with its stash and its Clue Board record; nothing the DM keeps |
| C4 | "a conversation about the game, etc., that they would know" | the ball is the character's memory and the party's notebook, not an oracle of the plot: it answers from what is on the table and says when it does not know |
| C5 | "cost effective caching context where possible ... sonnet or opus, no haiku ... 20-40 messages per month" | one deterministic context, cached in layers shared across players; the Opus or Sonnet of the day; caps that bound the worst month |
| C6 | "a node process that listens and handles the queries through the server, NOT clients" | a service beside Foundry holds the API key and makes every call; no client ever holds a key or talks to Anthropic |
| C7 | "an always on assistant gm level bot, managed by the server" | the service is logged into the world as a user of its own, connected around the clock, reading the world live; it is the one that knows what each player may see |
| C8 | "test on local sandbox (windows) but be able to deploy on linux (prod)" | plain Node, no native modules, no shell assumptions; a `.env` and a port on Windows, a systemd unit and a tunnel rule on the box |
| C9 | "we will need a name ... the typical two word naming convention" | a two-word thing, as Clue Board, Card Catalogue, Loot Shelf, Party Stash |

## The names

**`fvtt-mod-crystalball`, title `Open Roll 5e: Crystal Ball`**, package id = repo name. First pass on
foundryvtt.com (2026-11-01): the package pages `crystal-ball` and `crystalball` are both 404. **The definitive check
is the setup screen's `getPackages` with no world active** (the suite CLAUDE.md, *Names*), owed before the first
release. Fallbacks if it finds a clash: Scrying Pool, Seeing Glass.

In the module's own words: the **Crystal Ball** is the window (and the button, and what a player calls the whole
thing). The **Seer** is the Node service beside Foundry that answers it: it holds the key, keeps the ball's user
logged in, builds what the ball may know and makes the call. The **ball's user** is the Foundry user the Seer is
logged in as, *Crystal Ball* in the Players list. A **sitting** is one conversation between a player and the ball;
a player has one open sitting at a time and may start a new one. The **gaze** is what the ball knows for one
player at one moment: the layered context the Seer builds (the word the code and the usage log use for it).

## The shape, in one picture

```
  player's browser                       the box (prod) / this machine (sandbox)
  ┌───────────────────────┐             ┌──────────────────────────────────────────────┐
  │ Foundry client        │  cloudflared │  Foundry :30000  ◄──socket, as the ball's── │
  │  ├ game (socket)      │◄────────────►│     ▲ (sandbox: direct)      user (Player)  │
  │  └ Crystal Ball window│  /crystalball│     │ session probe                          │
  │     fetch + SSE ──────┼─────────────►│  the Seer :30001 (127.0.0.1) ──────────────►│──► Claude API
  │     X-Foundry-Session │             │     ├ gaze per player (memory only)          │    (Opus 5.5)
  └───────────────────────┘             │     ├ sittings/, usage.jsonl (disk)          │
                                        │     └ .env: the key, the ball's password     │
                                        └──────────────────────────────────────────────┘
```

Two trust boundaries. **Players never reach Anthropic**: the window talks only to the Seer, on the same origin as
Foundry on prod (a path rule in the tunnel) or on a second local port on the sandbox. **The Seer trusts Foundry
for identity**: a request carries the player's Foundry session id, and the Seer asks Foundry whose it is before it
reads a word of the world for them.

## Halruaa, measured (2026-11-01, the sandbox mirror of prod, Foundry 14.369, dnd5e 6.0.6)

| What | Measured | What it means for the gaze |
| --- | --- | --- |
| Journals | 8 entries, 32 pages; GM-only: *Map Keys* (5), *Bestiary* (11), *Scene Switches* (2), *sequencerDatabase*; player-facing: *Player Handouts* (the Player's Guide, 55 KB of HTML, and three image pages), *Session Diary* (3 sessions, 17 KB), *Player Backstories* (4 pages, 6 KB, one per character), *Player Scenes* (3 images) | the shared lore is one long page and a diary; ≈ 12–16k tokens as Markdown, growing a session's diary page (≈ 1.5k tokens) a week |
| Clue Board | 31 Clues on *Party*, 12 KB of clue text, each with a kind, a *found at* line, readers; threads with stand lines | ≈ 3–4k tokens, the same for every member of the party |
| Characters | 4, each 126–172 KB as raw export JSON, 37–64 items, 22–30 KB of item description HTML | the raw sheet never goes in; a curated sheet is ≈ 8–12k tokens, most of it the descriptions of what the character carries and can do |
| The party | one Group actor, *Party*, `ownership.default: 3`, 16 items, 73 KB raw | members, the stash and the coin ≈ 2k tokens; the Clue Board record rides on it |
| Users | 10: 1 Gamemaster, 2 Assistants (one the MCP's bridge user), 7 players, four with characters | the ball's user is an eleventh; four real askers |

**A player's gaze was estimated at 25–35k tokens and measured at ≈ 46k by the built Seer** (Drew's: instructions
0.8k, lore 37k, party 4.8k, own 3.1k; the Bestiary's eleven pages and the four backstories are `default: 2` on this
world, so they are every player's lore; the DM owns all four characters, so a DM sitting under the player gaze
carries four sheets, ≈ 19.5k in its own layer), well under any model's window; the whole visible corpus goes in,
no retrieval, no tools. The Seer measures it with `count_tokens` (free) at every rebuild and logs it, so the day
it passes a budget (D7) is seen, not guessed.

**Foundry 14.369, read in its own server code** (`resources/app/dist`, the local install), which settles how the
Seer logs in and whom it may believe:

- **A socket tells whose session it is.** On connect the server reads the `session` cookie off the handshake,
  looks it up in its in-memory session map and emits `session` with `{ sessionId, userId }` (`userId` null when the
  session has not joined the running world; `session` null when the cookie is unknown). No `world` request is
  needed. The cookie is HttpOnly on 14.369 (found in the build), so the window cannot read it; it sends the same
  id from the copy Foundry's own socket holds, `game.socket.session.sessionId`, in a header.
- **A second socket on a player's session is side-effect free.** A user is marked active once (a no-op when
  already active) and inactive only when their *last* socket drops, so the Seer's probe neither flickers the
  Players list nor logs anyone out. The probe connects, reads one event and disconnects.
- **Every connected user receives every document, whatever their role.** The `world` payload is the dump of every
  collection (users, actors, items, journal, folders, settings, messages, scenes, …) with no per-user filter;
  ownership is enforced on operations and in the client's UI. So the ball's user needs no GM role to see the
  world, and the Seer must do the per-player filtering itself (D5).
- **An idle GM-level socket would be the table's elect.** `game.users.activeGM` is the active user of the highest
  GM role, ties to the lower id. A socket that runs no modules, elected while the DM is away, is where By the
  Books' consequences and dnd5e's own GM-routed work would land and die. Hence a **Player-role** ball's user (D4).
- **Joining is a POST to `/join`** with `{ action: "join", userId, password }` (14.369 renamed the field from
  `userid`; the MCP's `join-form.ts` tracks the same reshaping); the reply sets the `session` cookie the socket
  then presents. Foundry 14 runs on Node ≥ 24.13 (its `package.json`), the same Node the Seer runs on.
- **Foundry's bundled Font Awesome has `fa-crystal-ball`** (`all.min.css`, `\e362`), so the button has a glyph
  without a picture.

## The module (the client half)

- **The button**: on `renderSidebar`, a button on the sidebar's strip placed after Clue Board's spy button
  (`#clueboard-mysteries-button`) when it is there, else directly after Journal (Clue Board inserts after Journal,
  so either hook order ends Journal, Clue Board, Crystal Ball). No `data-tab`, no `data-action`, nothing registered
  on `Sidebar.TABS`: Clue Board's rule. The glyph is `fa-crystal-ball`; its painted picture
  (`styles/icons/crystal-ball.webp`) shows under Card Catalogue's `cardcatalogue-tab-icons` body class.
- **The window** (`CrystalBallWindow`, ApplicationV2 + Handlebars, one per client, reused, centred): Card
  Catalogue's look copied by hand (the `--cb-*` palette, the bar, the buttons, dark in the light theme too) and
  its `host.js` copied by hand, so what the window opens follows it into a detached window. The transcript (the
  player's turns and the ball's, the ball's streamed in as it arrives), the input (Enter sends, Shift+Enter a
  newline, 4,000 characters), **New sitting**, and a status line: the model's family name, today's count against
  the player's allowance, *the ball is dark* when the Seer or the world is unreachable. The first line of a new
  sitting says what the ball knows and that the DM can read sittings.
- **What the ball says is rendered through a safe Markdown subset**: the text is HTML-escaped first, then
  paragraphs, emphasis, lists, headings and inline code are drawn; never raw HTML from the model, never
  `enrichHTML` on it.
- **The call**: `fetch` to the Seer with `X-Foundry-Session: <the session cookie's value>` and the message; the
  answer as Server-Sent Events (token deltas, then a `done` event with the usage line). No cookie is relied on:
  the header carries identity, so same-origin and cross-origin work alike. The service URL is a world setting,
  default the same-origin path `/crystalball` (prod); the sandbox sets `http://localhost:30001`.
- **Settings** (world, GM): *Enabled*; *Service URL*; *Table notes* (a text the DM writes for the ball: its
  manner, what it should decline, house facts); *Who may ask* (every player, or listed users); *The GM's gaze*
  (D10). The Seer reads these from the world's `settings` collection, so the DM configures the ball from Foundry
  and the Seer never needs a config edit on the box for table matters. Nothing client-scoped beyond Card
  Catalogue's button size.
- **The module alone does nothing but say the ball is dark**: its one dependency is the Seer, a *service*
  dependency documented as FX Studio documents `sequencer` (installs alone, enables alone, dark without it).
- Kit: `log.js` only. No elect (the Seer acts, never a client), no receipts, no class patches, no hooks of its
  own emitted in phase 1.

## The Seer (the server half)

Plain Node ≥ 24 (Foundry 14's own), ES modules, three runtime dependencies: `@anthropic-ai/sdk`, `socket.io-client`
4.x (Foundry 14 ships socket.io 4.8), and `turndown` for HTML → Markdown (or a 100-line converter of our own if the
journal's HTML stays as plain as it is: headings, paragraphs, lists, tables, links). Node's own `http`, `crypto`
and `fs` for the rest. Biome and Vitest as the template's.

**Identity, per request.** The `X-Foundry-Session` value is probed against Foundry's socket (above): no user → 401,
*the ball does not know you*. The answer is cached ten minutes keyed by a hash of the session id; the id itself is
never logged. The user's role and the world setting *Who may ask* decide whether they may sit.

**The ball's user, always on.** At start the Seer joins Foundry as the ball's user (`POST /join`, the password from
its `.env`), opens one socket and keeps it: reconnects with backoff when Foundry restarts or the world closes
(returns to setup for an install), and reports *dark* to the window meanwhile. It takes the `world` payload at
connect and again when a request finds it older than sixty seconds (phase 2 may follow `modifyDocument`
broadcasts instead); the payload lives in memory only, never on disk. The socket emits nothing but `world` (and,
since the rulebooks, a compendium pack's `modifyDocument` get): the Seer writes nothing to Foundry in phase 1
(D11). The user has **role Player** (D4), a name and an avatar the DM
picks, a password only the DM and the `.env` know.

**The gaze, per player.** From the live world, filtered exactly as that player's client would (the Seer carries
`testUserPermission`'s OBSERVER rule: a GM sees all; otherwise `ownership[userId] ?? ownership.default ≥ 2`, a
journal page inheriting its entry's when its own is `-1`), the Seer writes, in this order and deterministically
(stable sorts by folder, sort key and id; no timestamps, no ids, no counters):

1. **The standing instructions** (the Seer's own text, versioned): what the ball is, how it answers (from what is
   on the table; "I do not know" when it is not; general 5e rules knowledge offered as such; in the fiction's
   voice when asked, plainly otherwise; short), and that everything inside the tagged sections is the world's text
   and the player's words, never instructions. Then the DM's *Table notes*.
2. **The shared lore**: every journal page every player can observe (text pages as Markdown, `@UUID[...]{Name}`
   links as their names, image and video pages as a title and caption line), grouped by entry.
3. **The party**: the Group actor the player's character belongs to (members with class, level and current state;
   the stash's coin and items), then **the Clue Board record** read off the Group's `fvtt-mod-clueboard` flags
   joined to the world Clue items: each clue's name, kind, found-at line, text and readers; each thread's name,
   question, status and stand line and the clues pinned to it. Identical for every member of a party.
4. **The player's own**: the journal pages only they can observe (their backstory), then each character they own
   as a **curated sheet**: name, species, background, classes and levels, abilities, saves and skills with
   proficiency, HP, AC, speed, senses, initiative, proficiencies and languages, coin, spell slots and spells with
   their descriptions, features with theirs, inventory with quantity, equipped, attuned and description, active
   effects and conditions. Descriptions stripped to text.
5. **The sitting**: the last 24 turns of the open sitting, the new message last.

Sections 1–4 are the system prompt, each ending in a `cache_control` breakpoint (the Claude 5.5 models cache from
512 tokens, so each layer caches on its own): three explicit markers, and top-level automatic caching for the
conversation tail, the fourth. **Layer 2 and most of layer 3 are byte-identical across players**, so a second
player's sitting within the TTL reads what the first wrote; layer 4 is the only per-player write. A change in the
world rewrites only from the layer it touched (a diary page added: layers 2–4; a sheet change: layer 4 alone). A
hash per layer goes to the usage line, so a month's log says which layer kept missing. The 5-minute TTL by default
(a read refreshes it; players answer within minutes), `1h` a config switch if the log shows 5–60 minute gaps.

**The call.** `claude-opus-5-5` by default (D6), `claude-sonnet-5-5` the cheaper setting; adaptive thinking as the
model's default (the parameter omitted; these models do not take it off), `output_config.effort: "low"` for chat
(a config knob; Opus 5.5 defaults to medium, so it is set explicitly); `max_tokens` 2,048; streaming; the SDK's
refusal fallback on (`fallbacks: "default"`, the API's routing for a declined request). No server tools and no
prefill; since the rulebooks, two client tools that search and read the table's compendium books (the module's
contract, *The rulebooks*). The response's `usage` (input, cache write, cache read, output) and the config's price table make the
ledger line.

**Limits, all in the Seer** (the client's claims count for nothing): 10 messages per user per hour, 40 per day; a
message of 4,000 characters; a sitting window of 24 turns; a gaze budget of 120k tokens (past it the oldest diary
pages are summarised to their titles and the DM is warned in the log, phase 2 decides retrieval); a **monthly
spend ceiling** (config, $25 proposed) after which the ball is dark until the month turns, and a daily ceiling
($5) that catches a runaway in hours; 60-second call timeout, aborted when the player's connection drops. Outside
our code, the Console's workspace spend limit on a key made for this and nothing else.

**Storage**, `seer/data/` (gitignored, 0700): `sittings/<userId>/current.json` and the closed ones by start date
(kept 90 days), each the turns only, never the gaze; `usage.jsonl`, one line per call (when, user, model, the four
token counts, cost, the layer hashes, latency); the identity cache in memory. The DM reads sittings on the box
(stated to players in the window). No database: at forty messages a month a file a user is the honest size.

**Endpoints** (all under the base path): `POST chat` (SSE), `POST sittings/new`, `GET sittings/current`, `GET
usage/me` (the asker's counts and the table's month), `GET healthz` (version, Foundry connected, world open; no
secrets). The Seer binds `127.0.0.1` only. CORS is off on prod (same origin through the tunnel) and allows the one
configured origin on the sandbox.

## Security, as a threat table

| Who | What they could try | What stops it |
| --- | --- | --- |
| anyone on the internet | reach the Seer through the public hostname | the tunnel path rule reaches the Seer, but every request needs a Foundry session Foundry itself vouches for; the Seer answers 401 with no detail, and the box's firewall and `127.0.0.1` bind keep the port off the LAN |
| a player, scripted | spend the table's money | per-user hour and day caps, the daily and monthly ceilings, a 4,000-character message, the Console limit |
| a player, curious | read what the DM keeps (GM pages, the Bestiary, other players' sheets) | the gaze is built by the Seer from ownership, as their own client would draw it; a forged user id is impossible, identity comes from Foundry's session map, not the request |
| a player, impersonating | spend another player's allowance | the same: the session names the user |
| the world's text | a journal page or clue that says "ignore your instructions" | the ball has no tools and no side effects; the worst outcome is a bad answer to the one who asked; the standing instructions name the tagged sections as text |
| the model's answer | HTML or script in the window | escaped, then a Markdown subset; nothing enriched |
| the box | the key or the ball's password leaks | `.env` 0600 owned by the service user, `EnvironmentFile=` in the unit, never in a Foundry setting or a repo; the Seer logs a hash of a session, never the id; the usage log holds counts, not words |
| the ball's user | abused to write to the world | role Player, and the Seer emits only `world`; if it ever acts (phase 2), each write is a named, tested emit |
| Anthropic | the campaign's text leaves the box | it does, to the API, under the API's terms (not used for training; retained 30 days); the window says so once a sitting; nothing but the gaze and the sitting is sent |
| an upgrade | Foundry reshapes `/join`, `session` or `world` | a fixture test per build as the MCP keeps, and a row in the suite's `upgrade review` |

Not in the model: Cloudflare Access (players would need accounts), a WAF rule (a free rate-limit rule on the path
is a cheap addition if the log ever shows strangers), and encrypting sittings at rest (the box is private).

## Cost, worked for Halruaa

A gaze of 46k tokens (measured), an answer plus thinking of ≈ 800 output tokens, a new turn of ≈ 300 input tokens.

| | Opus 5.5 ($4 / $20 per MTok; 5-min cache write $5, read $0.20) | Sonnet 5.5 ($2 / $10; write $2.50, read $0.20) |
| --- | --- | --- |
| first message of a sitting (the gaze written) | ≈ $0.25 | ≈ $0.12 |
| a message within the TTL (the gaze read) | ≈ $0.027 | ≈ $0.018 |
| a month of 40 messages in 12 sittings | ≈ $3.80 | ≈ $1.95 |
| the same month with nothing cached | ≈ $8 | ≈ $4 |
| the worst month the caps allow (4 players × 40 a day, every message a miss) | the $25 ceiling | the $25 ceiling |

The model choice moves the month by a dollar; **the caps are what bound it**, and caching halves it. Opus 5.5 for
the better reader of a long diary at these sums (D6); the switch to Sonnet is one config line and the next sitting.

## Windows sandbox, Linux prod

- **One repo, two parts** (D2): the module at the root (`module.json`, `scripts/`, `styles/`, `templates/`,
  `lang/`), the Seer under `seer/` (`package.json`, `src/`, `tests/`, `config.json` with the defaults,
  `.env.example`, `deploy/crystalball.service.example`). The release zip packs only the served folders
  (`build-module-zip.mjs`'s rule), so the Seer never ships in the module; the box takes the Seer from a tag. One
  version in both `module.json` and `seer/package.json`; `healthz` reports it and the window warns on a mismatch.
- **Sandbox (Windows)**: `npm start` in `seer/` with a `.env` (`FOUNDRY_URL=http://localhost:30000`,
  `PORT=30001`, `CORS_ORIGIN=http://localhost:30000`, `BALL_USER`, `BALL_PASSWORD`, `ANTHROPIC_API_KEY`); the
  module deployed with the MCP's `deploy-house-module.mjs --local` as every module; the world setting *Service
  URL* `http://localhost:30001`. The ball's user is created on prod first and reaches the sandbox with the next
  mirror (a mirror copies users and settings; the Seer's `.env` on each machine carries the same password).
  **The sandbox's one GM seat is untouched**: the Seer's socket is a Player, and its probe is a read.
- **Prod (Linux)**: a service user, the repo at a tag under its home, `npm ci --omit=dev`, a systemd unit
  (`Restart=always`, `EnvironmentFile=` the 0600 `.env`, `ProtectSystem=strict`, `ProtectHome=read-only` with the
  data dir read-write, `NoNewPrivileges`); the Seer on `127.0.0.1:30001` under `BASE_PATH=/crystalball`; **a
  tunnel ingress rule** `hostname: foundry.openrollstudios.com, path: ^/crystalball(/|$)` → `http://localhost:30001`
  placed before the catch-all to Foundry. The unit, the paths, the password and the key are the box's machine
  record in the user's private per-machine repo; the public repo ships examples with placeholders and no name,
  path or address of the box. The module itself arrives as every module does: the installer from the release.
  **Updating the Seer** is `git fetch && git checkout vX.Y.Z && npm ci --omit=dev && systemctl restart`, by hand
  over SSH or by a `tools/deploy-seer.mjs` that reads the host from the same private env the mirror's `--from`
  does; never from this machine's disk.
- **What the suite's tooling learns**: the ball's user is a connected Player, so `pull-prod-to-local.mjs` (refuses
  while players are connected) and `list-users` must know it by a user flag the DM sets once
  (`fvtt-mod-crystalball.ball: true`) and leave it out of "players connected". Open Server's jump list skips a user
  with no character already. Combat Plus's alerts reach a socket that ignores them.

## How it fits the family

- `repos.json`: `fvtt-mod-crystalball`, kind `mod`, public, active, `"kit": true`, a blurb; then
  `suite-sections`, `integration-map`, `upstream-surface`, `kit-sync`, committed in each repo and here.
- **Detection, never `requires`**: Clue Board present → the record is read (its flag schema, version 2, the
  `entries` and `threads` Clue Board's CLAUDE.md lays out; a schema bump is a line here); absent → no clues
  section. Party Stash present or not, the Group's inventory is Foundry's. Card Catalogue present → the painted
  button; absent → the glyph.
- **A copy kept by hand, now in three places**: Card Catalogue's look and its `host.js` (Clue Board's rule: a
  change to one is made in all). `pick.js` is not needed (nothing to multi-select).
- **No hook emitted, none listened to** in phase 1. The Seer reads Clue Board's flags, By the Books' nothing.
- **Releases**: the module through the reusable `release-module.yml` from an annotated tag (a patch by default);
  the Seer deployed from the same tag. The suite CLAUDE.md's *State* names the module's version on prod and the
  Seer's.
- **Upgrade reviews**: a row for the Seer's three Foundry contracts (`/join`'s body, the `session` event, the
  `world` payload) beside the MCP's `/join` row.
- **Public text** says "part of Open Roll 5e" and names no machine; the Seer's README is the hosting guide for
  another table (any Node 24 host beside their Foundry, any reverse proxy or tunnel that routes a path).

## Phases

**Phase 0, the spike (half a day, on the sandbox).** A sixty-line script in `seer/tools/spike.mjs`: join as a
scratch Player user, open the socket, time and size the `world` payload; probe a real session cookie (the user's own
browser) and print its `userId`; build one player's gaze with the filter above and `count_tokens` it; one streamed
call. It proves the three Foundry contracts on 14.369 and turns the ≈ 25–35k estimate into a number. **Owed before
a line of the window is written.**

**Phase 1, the ball.** The repo from the template; the Seer (identity, the ball's user, the gaze, the call, the
limits, the ledger, the endpoints, the unit tests with the API and Foundry mocked, the `/join` fixture); the module
(the button, the window, the stream, the settings); `tools/live-check.mjs` on the sandbox in the house pattern (a
GM page and a temporary player page open the window, ask what the party knows about the Lamp of 1391, assert a
streamed answer that names it and a usage line: one real call, cents); README and CLAUDE.md; `repos.json` and the
generators. Then prod, on the user's word: the ball's user, the key with its Console limit, the `.env`, the unit,
the tunnel rule, the installer, *Enabled*, a first sitting by the DM.

**Phase 2, later, each on the user's word.** The DM's usage panel in the window; `1h` TTL if the ledger says so;
the recent chat log (By the Books' cards) as a layer; the ball whispering an answer into chat on request (a
Player may whisper: the Seer's first write, named and tested); `modifyDocument` tracking instead of refetching;
retrieval if a table's lore outgrows the budget; several parties.

## Decisions

| # | Decision | Ruled |
| --- | --- | --- |
| D1 | **Crystal Ball**, `fvtt-mod-crystalball`; the Seer, the ball's user, a sitting, the gaze | proposed; the `getPackages` check before release |
| D2 | One repo, the module at the root and the Seer under `seer/`, one version, the zip without the Seer | proposed |
| D3 | The Seer is a raw socket.io client, never a browser; it runs no modules and acts for no one | **ruled** 2026-11-01 ("socket it for now"); the resident GM page is its own later plan |
| D4 | The ball's user has **role Player**: it sees the whole world anyway, and a GM-level socket would be elected to act while the DM is away | **ruled** 2026-11-01 with D3 |
| D5 | The gaze is built by the Seer from the live world under Foundry's ownership rule, never assembled by the client | proposed |
| D6 | Opus 5.5 by default, Sonnet 5.5 a config switch, effort low, thinking the model's default, 2,048 output tokens | proposed |
| D7 | Four cache layers in the order instructions, shared lore, party, own; 5-minute TTL; a 120k gaze budget | proposed |
| D8 | Caps: 10/hour and 40/day a user, $5 a day and $25 a month for the table, 4,000 characters, 24 turns | proposed; the dollar figures are the user's |
| D9 | JSON files under `seer/data/`, sittings kept 90 days, the gaze never written to disk | proposed |
| D10 | The DM's gaze is a player's by default (what every player can see, plus the DM's own), GM-only pages excluded unless the setting says otherwise, so the DM tests what the players get | proposed |
| D11 | The Seer writes nothing to Foundry in phase 1 | proposed |
| D12 | Same origin on prod by a tunnel path rule; a second port with CORS on the sandbox; identity by header, never by cookie, so both work alike | proposed |
| D13 | The window is Card Catalogue's look and `host.js`, copied by hand; a button after Clue Board's, never a tab | proposed, from Clue Board's rulings |
| D14 | Players' sittings are private to each player; the DM may read them on the box and the window says so | proposed |

## Open questions for the user

1. ~~D4: Player role or Assistant GM?~~ Ruled: Player, with the socket (D3). A GM-level bot that acts must be a
   browser page running the modules, as the MCP's bridge is, so it can safely be the elect: a different and heavier
   service, planned on its own when the user wants the table to run without them.
2. The ball's user's name and avatar in the Players list (*Crystal Ball*; the painted icon?).
3. The dollar ceilings in D8, and whether a player should see their own count in the window's status line.
4. Opus 5.5 or Sonnet 5.5 as the default (D6); the figures above.
5. Whether the DM's own sittings should ever carry GM-only pages (D10).
6. Whether the ball should also know the recent chat log in phase 1 (it is in the `world` payload already; it is
   another layer and another few thousand tokens a session).
