# Dead: one rule for the family

The core `dead` status (the skull overlay, `CONFIG.statusEffects` id `dead`) and a combatant's
**defeated** mark are written by three hands in a table that runs Open Roll 5e (dnd5e, By the
Books, Combat Plus), and read by two more (Token Art, By the Books' summons). This page is the one place that says who writes what, when, and in which order; each
writer's README points here. It describes the code as it stands; the open contradiction at the
end waits for a ruling.

## The writers

| Writer | When | What it writes | Where it clears | Client |
| --- | --- | --- | --- | --- |
| **dnd5e**, *Apply Downed Conditions* (`dnd5e.autoApplyDowned`: none, deadOnly, npcs, all; `Actor5e#updateDowned`) | a creature **in the active combat** drops to 0 Hit Points | an NPC that is not *important*: **Dead** (from deadOnly up). An important NPC (npcs, all) and a player character (all): **Unconscious** (with its Prone rider), **Dead** once three death saves have failed. Each effect flagged `dnd5e.autoDowned` | the Hit Points come back above 0, in or out of combat: dnd5e deletes its `autoDowned` effects (the Prone rider stays, as written) | the client that wrote the Hit Points |
| **By the Books**, the downed conditions out of combat (`scripts/drop-to-one.js`, `decide/drop-to-one.js` `downedOutcome`) | a creature **not in combat** drops to 0 Hit Points | dnd5e's own mapping, under dnd5e's own setting, with dnd5e's `autoDowned` flag (so dnd5e's removal on the heal is the one that ends it); once per drop | dnd5e's, as above | the client that wrote the Hit Points |
| **By the Books**, a revert (`scripts/receipts.js` `revertTarget`, `decide/receipt.js` `revertPlan`) | a damage receipt is reverted to Hit Points above 0 | clears **Dead** first, while the Hit Points are still 0, then writes the Hit Points, then clears every combatant's **defeated** mark the way Combat Plus matches them (`clearDefeated`) | n/a | the reverting client |
| **By the Books**, a kill: a save's failure that slays (`decide/registry.js` rows with `status: "dead"`, Nine Lives Stealer's Life Stealing) and a clock rider's `destroy` row (`scripts/clock-riders.js` `destroyAfterReceipt`: a creature left at or below the row's number) | the rule's own trigger | **Dead** first, then 0 Hit Points (a status after the Hit Points would race dnd5e's own) | the Hit Points coming back (dnd5e's removal does not touch it: it carries no `autoDowned` flag; Combat Plus's clear does) | the moment's driver |
| **By the Books**, the death saves (`scripts/death-saves.js`) | a creature that makes death saves (a character, an important NPC) rolls its third success; damage at 0 Hit Points | the system's own **Stable** status (`CONFIG.DND5E.statusEffects.stable`, which dnd5e defines and never applies), flagged `dnd5e.autoDowned`; damage at 0 Hit Points clears it. A third failure **out of combat** (a roll's or the damage's): **Dead** under dnd5e's mapping and setting, with its flag, as the out-of-combat drop above | the Hit Points coming back (dnd5e's removal); the damage, for Stable | the rolling or applying client |
| **Combat Plus**, *Auto-Defeated: NPCs* / *Auto-Defeated: PCs* (both on by default; `scripts/combatplus.js`, the `updateActor` hook) | any Hit Points change, in or out of combat | at 0 or below: **Dead** with the overlay (`toggleStatusEffect`) and **defeated** on every combatant for the actor; above 0: both cleared | the same hook, on the heal | the active GM |

Three readers act on it. **By the Books' death saves** read the **Dead** and **Stable** statuses, never who wrote them: a creature wearing either is asked no Death Saving Throw at its turn start, so Combat Plus's *Auto-Defeated: PCs* must be off at a table that plays death saves. **Token Art** wears the `-dead` look at 0 Hit Points or under the **Dead**
status (its *Dead look* switch), for player characters too, and never writes a status. **By the
Books' summons** (`scripts/summons.js`, on the active GM) read the **Dead** status landing on a
caster as the caster's death, never 0 Hit Points alone (that is dying): a summon whose text ends at
the caster's death is dismissed, and a companion the caster empowered reverts.

## The order that holds

1. **A status is written once.** The status ids are fixed, so a second create of `dead` is refused
   as a duplicate. Combat Plus and By the Books' out-of-combat pass check the actor's statuses before
   they write.
2. **On a heal, the system's removal wins.** dnd5e deletes its `autoDowned` effects the moment the Hit
   Points come back; By the Books lets that removal end its own out-of-combat conditions (same flag).
   Combat Plus's clear on the same update races it, and the loser of a delete throws (logged, nothing
   lost).
3. **On a revert, Dead goes before the Hit Points.** A clear after the Hit Points write races dnd5e's
   `updateDowned`; `revertTarget` clears first. The defeated mark is cleared after, matching combatants
   the way Combat Plus does (a linked actor's tokens, an unlinked token by its token id).
4. **Readers tolerate every writer.** Token Art and By the Books' geometry (`scripts/geometry.js`,
   `scripts/bash-offer.js`: a Dead creature is skipped) read the status, never who wrote it.

## What agrees with the book, as configured today

dnd5e's *Apply Downed Conditions* at **all** (the house worlds' setting) is the book: a player character
at 0 Hit Points is Unconscious and dying, and Dead after three failed death saves. To keep Combat Plus
from stamping Dead on a dying character, turn **Auto-Defeated: PCs** off in Combat Plus (its README
says the same: "turning off PCs leaves player characters to their death saves"). Token Art's dead look
at 0 Hit Points is a table's taste, documented in its README; its switch turns it off.

## Open: two writers contradict each other (waits for a ruling)

With Combat Plus's defaults (both switches on) and dnd5e at *npcs* or *all*:

- **A player character at 0 Hit Points** (dnd5e at *all*) wears dnd5e's (or By the Books')
  **Unconscious** and Combat Plus's **Dead** at once, and is marked defeated. The book says dying, not dead, and the Dead status
  has a consequence: By the Books reads it as the caster's death, so a dying caster's summons that
  end at its death are dismissed and its empowered companion reverts.
- **An important NPC at 0 Hit Points** (dnd5e's `traits.important`) wears **Unconscious** and **Dead**
  at once: Combat Plus has one NPC switch and does not read `important`.
- **A non-important NPC at 0 Hit Points in combat** gets **Dead** from both dnd5e and Combat Plus; the
  second create is refused as a duplicate (rule 1), so the outcome agrees and the log carries an error.

No behaviour was changed for this page. The choices, for the user: Combat Plus defers to dnd5e when
*Apply Downed Conditions* is on (marks defeated, writes no status of its own), or reads dnd5e's mapping
(`important`, death saves), or the PCs switch defaults to off; and whether Token Art's dead look follows
the Dead status alone rather than 0 Hit Points.
