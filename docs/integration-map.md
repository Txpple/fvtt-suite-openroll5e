# Integration map

Generated 2026-10-10 by `tools/integration-map.mjs` from the clones next to this file's repo. Do not edit by hand; rerun the script.

## Modules

| Repo | Package id | Foundry title | Version | Foundry | System | Requires |
|---|---|---|---|---|---|---|
| fvtt-mod-areasounds | fvtt-mod-areasounds | Open Roll 5e: Area Sounds | 2.0.0 | 13–14 | any | none |
| fvtt-mod-autoexplore | fvtt-mod-autoexplore | Open Roll 5e: Autoexplore | 1.1.1 | 13–14 | any | none |
| fvtt-mod-battleflow | fvtt-mod-battleflow | Open Roll 5e: Battle Flow | 2.16.2 | 14–14 | dnd5e | none |
| fvtt-mod-combatplus | fvtt-mod-combatplus | Open Roll 5e: Combat Plus | 1.5.1 | 13–14 | any | none |
| fvtt-mod-errata5e | fvtt-mod-errata5e | Open Roll 5e: Errata | 1.2.1 | 13–14 | dnd5e | none |
| fvtt-mod-fxstudio | fvtt-mod-fxstudio | Open Roll 5e: FX Studio | 0.8.0 | 14–14 | dnd5e | sequencer |
| fvtt-mod-lootshelf | fvtt-mod-lootshelf | Open Roll 5e: Loot Shelf | 1.3.1 | 13–14 | dnd5e | none |
| fvtt-mod-openserver | fvtt-mod-openserver | Open Roll 5e: Open Server | 1.3.1 | 11–14 | any | none |
| fvtt-mod-partystash | fvtt-mod-partystash | Open Roll 5e: Party Stash | 1.8.2 | 13–14 | dnd5e | none |

## Who references whom

Occurrences of another suite package's id in source (`game.modules.get`, settings keys, flags, docs strings). A reference means the code knows the other module exists; every module still works alone.

| From | To | Hits | First seen in |
|---|---|---|---|
| fvtt-mcp-dnd5e | fvtt-mod-areasounds | 8 | fvtt-mcp-dnd5e/scripts/verify-areasounds-tooling.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-openserver | 6 | fvtt-mcp-dnd5e/scripts/verify-landing-scene.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-autoexplore | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-battleflow | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-combatplus | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-fxstudio | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-lootshelf | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-partystash | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-dnd5e | fvtt-mod-miscpatches | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-sessionscribe | fvtt-mod-battleflow | 3 | fvtt-mcp-sessionscribe/src/page/combat-stats.ts |
| fvtt-mod-areasounds-sfx | fvtt-mod-areasounds | 1 | fvtt-mod-areasounds-sfx/tools/remap-areasounds-scene-paths.mjs |
| fvtt-mod-battleflow | fvtt-mod-fxstudio | 4 | fvtt-mod-battleflow/tools/smoke-hitmenu.mjs |
| fvtt-mod-battleflow | fvtt-mod-errata5e | 1 | fvtt-mod-battleflow/tools/smoke-aasimar.mjs |
| fvtt-mod-fxstudio | fvtt-mod-battleflow | 5 | fvtt-mod-fxstudio/scripts/readers/battleflow.js |
| fvtt-mod-lootshelf | fvtt-mod-partystash | 4 | fvtt-mod-lootshelf/tools/verify-receipt-settings.mjs |

## Custom hooks

Hooks named after a suite module (`battleflow.*`, `fxstudio.*`, ...). Emitters call them; listeners subscribe. Anything listed under both is the real cross-module contract.

| Repo | Emits | Listens |
|---|---|---|
| fvtt-mod-battleflow | battleflow.areaAskAnswered (1), battleflow.armorBlock (1), battleflow.styleDice (1), battleflow.moment (1), battleflow.${event} (1), battleflow.holdOpened (1), battleflow.castReleased (1), battleflow.deferredUsageCard (1) | battleflow.moment (11), battleflow.styleDice (1), battleflow.armorBlock (1), battleflow.holdOpened (1) |
| fvtt-mod-fxstudio | fxstudio.rebuilt (1), battleflow.moment (1) | battleflow.moment (1), fxstudio.rebuilt (1) |

