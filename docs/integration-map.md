# Integration map

Generated 2026-10-20 by `tools/integration-map.mjs` from the clones next to this file's repo. Do not edit by hand; rerun the script.

## Modules

| Repo | Package id | Foundry title | Version | Foundry | System | Requires |
|---|---|---|---|---|---|---|

## Who references whom

Occurrences of another suite package's id in source (`game.modules.get`, settings keys, flags, docs strings). A reference means the code knows the other module exists; every module still works alone.

| From | To | Hits | First seen in |
|---|---|---|---|
| fvtt-mcp-dnd5e | fvtt-mod-battleflow | 6 | fvtt-mcp-dnd5e/src/utils/bridge-facts.ts |
| fvtt-mcp-dnd5e | fvtt-mod-miscpatches | 2 | fvtt-mcp-dnd5e/docs/history/review-2026-09/scripts/siblings-census.mjs |
| fvtt-mcp-sessionscribe | fvtt-mod-battleflow | 13 | fvtt-mcp-sessionscribe/src/foundry/protocol.ts |

## Custom hooks

Hooks named after a suite module (`bythebooks.*`, `fxstudio.*`, ...). Emitters call them; listeners subscribe. Anything listed under both is the real cross-module contract.

| Repo | Emits | Listens |
|---|---|---|

