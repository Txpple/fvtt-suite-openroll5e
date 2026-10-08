# Session 8 — GM Notes · Mechanics (2026-09-22)

_The system, the sheets, and the table: bookkeeping to apply, automation that cost time,
rulings to keep consistent, and player-side observations. Plot is in `gm-notes-story.md`; the
combat numbers are in `combat-stats.md`._

> **Act on this first:** Hunter's Mark added **zero** damage all night — no force damage on any
> of Jetten's seven marked hits, where session 7 logged 37. It fails silently, so nobody at the
> table noticed. Check it before the finale.

---

## 1 · Bookkeeping to apply before the finale

- [ ] **Invictus is attuned to four items** (limit 3): Cloak of Protection, Gauntlets of Ogre
      Power, Midnight, **the Thornheart**. One has to come off. The Gauntlets are what give him
      STR 19 for Shield Master; the Cloak is +1 AC and saves.
- [ ] **The hoard's coin.** The hoard card describes *"coins lie in drifts under a skin of
      lake-silt"*, but only gems and items reached the stash (party purse: 3 pp · 451 gp · 35 sp).
      Name a figure or leave it as flavour.
- [ ] **Unclaimed in the stash:** Staff of Withering (rare, attunement), Decanter of Endless Water,
      a second Driftglobe, Rival Coin, 13 gems (~10,700 gp), 1 Potion of Poison Resistance.
- [ ] **Potions of Fire Breath:** Morgash drank his (0 uses left, still on the sheet); Invictus
      shows ×2 at 0/1 after drinking one; Jetten's is unused. Tidy, or leave: the effect lasts an
      hour and allows three exhales, so the drunk ones are spent either way.
- [ ] **Veck's signet ring and finger.** Morgash offered it to Selma and she dropped it. The item
      is still on Morgash's sheet. Did she keep it?
- [ ] **Lingering effects:** Invictus still shows *Death Armor* and a *"Damaged: −2 AC"* (the
      Miasma) after the fight; Gren has Mage Armor, Death Ward, Poison Resistance, Antitoxin,
      Innate Sorcery and Bestial Communication still up. Clear them at the long rest.
- [ ] **Gren's duplicate spell entries:** *Counterspell* ×2, *Dispel Magic* ×2, *Magic Missile* ×2.
- [ ] **Squirrel tokens** (Pudgy, Honeysuckle, Pinenut) are still on Bramblemaw's Lair at 0.
      If the party raises Pudgy, restore his HP.
- [x] **Heroic Inspiration for Morgash** — paid at the top of the session and spent in the
      dragon fight.
- [x] **Party snapshot** written: `party-snapshots/2026-09-22.md` plus the four JSON exports.

## 2 · Automation that cost time — fix before the finale

Ranked by how much it cost. Much of this looks like fallout from the forced update (*"the chat
cards look a little different because of the update that was forced on us"*; *"it broke
everything in automations"*).

1. **Hunter's Mark bonus damage never applied.** It was marked and moved twice, and all seven
   hits came through as `1d8 + 2 + 4` piercing with no d6 force. That's about 28 damage lost
   (the crit included), and nobody noticed because nothing errors. It worked in session 7.
2. **The Loot Shelf / merchant broke mid-shop.** Selma's inventory showed empty (*"the upgrade
   equipped everything on her"*), players couldn't pick items up, you dropped the poison potions
   into the stash by hand, and later the Thornheart couldn't be picked up until you re-placed
   it. That's most of why shopping ran about 25 minutes.
3. **Careful Spell on *Slow* still prompted Invictus for a save.** Invictus got slowed and you
   reverted it. Gren said the Careful pop-up never appeared. On the final Fireball he worked
   around it by aiming so only the dragon was inside. This is the session-7 Fireball/Careful issue
   in a new form.
4. **Magic Missile targeted Invictus** when Gren had the dragon marked. Your view showed
   Invictus as the target. You reverted and Gren recast.
5. **Shield Master offered a bash on a thrown javelin.** It needs a melee hit within 5 ft.
   Invictus noticed it himself: *"that can't be right"*.
6. **Concentration prompt on Gren with no visible concentration** (*"I'm not concentrating on
   anything"*). It was *Slow*, but the UI wasn't showing it to him.
7. **Scene and token setup.** The party was placed on the wrong map at the start, Morgash
   couldn't see his token, and Invictus was stuck, "prone somehow", mid-shopping.
8. **Two d20-fold prompts timed out on Morgash at 24 s** (the Bless / Heroic Inspiration offer).
   Same timer note as session 7.

## 3 · Rulings made — keep consistent

- **Action Surge was used twice in the dragon fight.** Round 3 came off the sheet; round 4 was
  on your call, *"You have two Action Surges"*. RAW at Fighter 6 it's **one use per short or
  long rest**, and two uses start at level 17. The second surge supplied 29 damage, and the
  dragon died with 3 HP of overkill. Not a retcon. Decide whether it was a house allowance
  before Morgash asks again in the finale.
- **Divine Smite needs the bonus action**, so it can't be combined with *Misty Step*. Ruled
  correctly, and it's why Invictus's big turn had no smite.
- **Shield Master's bash has no size limit.** A Huge dragon can be knocked prone. Ruled yes;
  that matches 2024.
- **Counterspell (2024) is a Con save** against the caster's DC, which is 18 for Gren with the
  Vesper Staff. You read it off the new rules at the table.
- **Spike Growth:** no damage for standing still, and 2d4 per 5 ft moved.
- **Prone target, attacker at 10 ft reach:** disadvantage, not advantage. You checked it and
  ruled correctly against the Pike.
- **Grappled by the crocodile = Restrained:** his attacks at disadvantage, attacks against him
  at advantage.
- **Death Armor: once per day.**
- **Spellfire Burst needs a Metamagic spend** that turn.
- **Damage at 0 HP:** you said the second breath *"would have auto-crit him"* had Invictus
  still been down. RAW, damage from a save effect at 0 HP is **one** death-save failure. A crit
  (two failures) only comes from an attack within 5 ft. Massive damage kills only if the
  leftover damage is at least his HP max (53).
- **Thornheart *raise dead*:** the card says ten days. At the table it came out as *"two days or
  10 days"*, so go with ten.
- **Mundane arrows aren't tracked** (restated to Morgash).

## 4 · Player and table observations

- **Robert (Invictus)** nearly halved his decision time (14.1 s → 8.6 s), and the Misty Step
  into a shield bash was the best-built turn of the fight. But **no Divine Smite and no Vow of
  Enmity against the dragon**, despite three reminders from you (*"look at all of your plethora
  of abilities"*, *"that's your last reminder"*). Four 1st-level slots and a 2nd were still unspent
  at the end. Putting Smite and Vow on his hotbar would pay off in the finale.
- **Drew (Jetten)** was the fastest seat again (3.1 s). He drank **Antitoxin instead of his
  resistance potion** before the doors. The unresisted first breath (32) set up his first down.
  Resistance first would have left him at about 9 after the Mind Spike.
- **Anthony (Morgash)** carried the dragon fight (107 damage, 4-for-4 topples) and had the best
  RP beat of the shopping trip (the finger for Selma). He's slower on prompts (15.2 s), with two
  24 s timeouts.
- **Tom (Gren)** ran the squirrel cult and got the kill. Said *"I'm gonna ask Claude"* for a
  rules check mid-fight. Careful Spell UI confusion again.
- **Pacing:** 2h59m. First combat at 1h18m. The dragon took about 50 minutes for 4 rounds
  (~12.5 min a round). The dream and breakfast ran ~30 minutes, shopping ~25.
- **Your audio dropped for the table briefly** during the dream narration (*"Oh, now we can hear
  you"*). The story beats all made it onto the recording.
- **End of night, off the record:** you showed the table the AI-generated scene art and
  explained the pipeline, and the players asked about the portraits. The finale was announced.

## 5 · Combat observations — pointer

Full report in `combat-stats.md` / `combat-log.html`. The things to carry into the finale:

- **3 HP of margin on the dragon.** Topple's advantage (65), the second Action Surge (29) and
  the wand's Magic Missile (22) were each individually decisive.
- **Poison Resistance was the best 800 gp the party has spent** (~75 prevented). **Fire Breath
  was the worst 600 gp** (8 damage).
- **Sap and Aura of Protection changed no outcome.** Hunter's Mark added nothing (see §2.1).
