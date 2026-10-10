# Upstream versions

Where Foundry and the dnd5e system stand for the Open Roll 5e family. The daily watch
(`tools/upstream-watch.mjs`, run by `.github/workflows/upstream-watch.yml`) writes **Latest
published**, **First seen** and **Newest pre-release**. **Reviewed** belongs to the upgrade review
and moves only when every repo's row on that review's issue has a verdict.

- **Foundry:** only a Stable release asks for a review. A Testing or Development build is shown
  under Newest pre-release, so a host running one is not a surprise.
- **dnd5e:** published GitHub releases of `foundryvtt/dnd5e`.
- The premium books are not tracked here; Errata (`fvtt-mod-errata5e`) watches them.

<!-- versions:start -->
| Package | Name | Reviewed | Reviewed on | Latest published | First seen | Newest pre-release |
| --- | --- | --- | --- | --- | --- | --- |
| foundry | Foundry VTT | 14.369 | 2026-10-10 | 14.369 | 2026-10-10 | — |
| dnd5e | dnd5e system | 6.0.6 | 2026-10-10 | 6.0.6 | 2026-10-10 | — |
<!-- versions:end -->
