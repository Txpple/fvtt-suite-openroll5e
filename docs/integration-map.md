# Integration map

Generated 2026-10-29 by `tools/integration-map.mjs` from the clones next to this file's repo. Do not edit by hand; rerun the script.

## Modules

| Repo | Package id | Foundry title | Version | Foundry | System | Requires |
|---|---|---|---|---|---|---|
| fvtt-mod-areasounds | fvtt-mod-areasounds | Open Roll 5e: Area Sounds | 2.0.2 | 13–14 | any | none |
| fvtt-mod-autoexplore | fvtt-mod-autoexplore | Open Roll 5e: Autoexplore | 1.1.2 | 13–14 | any | none |
| fvtt-mod-bythebooks | fvtt-mod-bythebooks | Open Roll 5e: By the Books | 3.4.18 | 14–14 | dnd5e | none |
| fvtt-mod-clueboard | fvtt-mod-clueboard | Open Roll 5e: Clue Board | 0.1.0 | 13–14 | dnd5e | none |
| fvtt-mod-combatplus | fvtt-mod-combatplus | Open Roll 5e: Combat Plus | 1.7.2 | 13–14 | any | none |
| fvtt-mod-errata5e | fvtt-mod-errata5e | Open Roll 5e: Errata | 1.2.2 | 13–14 | dnd5e | none |
| fvtt-mod-fxstudio | fvtt-mod-fxstudio | Open Roll 5e: FX Studio | 0.10.7 | 14–14 | dnd5e | sequencer |
| fvtt-mod-houserules | fvtt-mod-houserules | Open Roll 5e: House Rules | 1.1.0 | 13–14 | dnd5e | none |
| fvtt-mod-lootshelf | fvtt-mod-lootshelf | Open Roll 5e: Loot Shelf | 1.3.2 | 13–14 | dnd5e | none |
| fvtt-mod-openserver | fvtt-mod-openserver | Open Roll 5e: Open Server | 1.4.0 | 11–14 | any | none |
| fvtt-mod-partystash | fvtt-mod-partystash | Open Roll 5e: Party Stash | 1.8.3 | 13–14 | dnd5e | none |
| fvtt-mod-tokenart | fvtt-mod-tokenart | Open Roll 5e: Token Art | 1.0.2 | 13–14 | dnd5e | none |

## Who references whom

Occurrences of another suite package's id in source (`game.modules.get`, settings keys, flags, docs strings). A reference means the code knows the other module exists; every module still works alone.

| From | To | Hits | First seen in |
|---|---|---|---|
| fvtt-mcp-dnd5e | fvtt-mod-areasounds | 11 | fvtt-mcp-dnd5e/scripts/verify-areasounds-tooling.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-battleflow | 6 | fvtt-mcp-dnd5e/src/utils/bridge-facts.ts |
| fvtt-mcp-dnd5e | fvtt-mod-bythebooks | 5 | fvtt-mcp-dnd5e/src/page/world.ts |
| fvtt-mcp-dnd5e | fvtt-mod-openserver | 3 | fvtt-mcp-dnd5e/src/page/world.ts |
| fvtt-mcp-dnd5e | fvtt-mod-autoexplore | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-combatplus | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-fxstudio | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-lootshelf | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-partystash | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-miscpatches | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-sessionscribe | fvtt-mod-bythebooks | 19 | fvtt-mcp-sessionscribe/src/page/combat-stats.ts |
| fvtt-mcp-sessionscribe | fvtt-mod-battleflow | 13 | fvtt-mcp-sessionscribe/src/foundry/protocol.ts |
| fvtt-mod-areasounds-sfx | fvtt-mod-areasounds | 1 | fvtt-mod-areasounds-sfx/tools/remap-areasounds-scene-paths.mjs |
| fvtt-mod-bythebooks | fvtt-mod-battleflow | 37 | fvtt-mod-bythebooks/scripts/core.js |
| fvtt-mod-bythebooks | fvtt-mod-fxstudio | 5 | fvtt-mod-bythebooks/tools/contracts.mjs |
| fvtt-mod-bythebooks | fvtt-mod-houserules | 3 | fvtt-mod-bythebooks/scripts/settings.js |
| fvtt-mod-bythebooks | fvtt-mod-lootshelf | 1 | fvtt-mod-bythebooks/scripts/summons.js |
| fvtt-mod-bythebooks | fvtt-mod-errata5e | 1 | fvtt-mod-bythebooks/tools/smoke-aasimar.mjs |
| fvtt-mod-combatplus | fvtt-mod-lootshelf | 1 | fvtt-mod-combatplus/scripts/combatplus.js |
| fvtt-mod-fxstudio | fvtt-mod-bythebooks | 8 | fvtt-mod-fxstudio/scripts/readers/bythebooks.js |
| fvtt-mod-fxstudio | fvtt-mod-battleflow | 5 | fvtt-mod-fxstudio/scripts/readers/bythebooks.js |
| fvtt-mod-lootshelf | fvtt-mod-partystash | 5 | fvtt-mod-lootshelf/tools/live-check.mjs |

## Custom hooks

Hooks named after a suite module (`bythebooks.*`, `fxstudio.*`, ...). Emitters call them; listeners subscribe. Anything listed under both is the real cross-module contract.

| Repo | Emits | Listens |
|---|---|---|
| fvtt-mod-bythebooks | bythebooks.areaAskAnswered (1), bythebooks.armorBlock (1), bythebooks.styleDice (1), bythebooks.moment (2), bythebooks.${event} (1), bythebooks.holdOpened (2), bythebooks.castReleased (1), bythebooks.deferredUsageCard (1) | bythebooks.moment (13), bythebooks.styleDice (1), bythebooks.armorBlock (1), bythebooks.holdOpened (1) |
| fvtt-mod-fxstudio | fxstudio.rebuilt (2) | bythebooks.moment (1), battleflow.moment (1), fxstudio.rebuilt (1) |
| fvtt-mod-tokenart | tokenart.changed (1) | — |

