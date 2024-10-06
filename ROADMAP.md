# Gunther Bot Roadmap

## 💻 Better Dataset

### Summary

The old dataset was web-scraped from the Wiki. It wasn't fully complete, tightly coupled to the formatting of the content in the Wiki's UI, and difficult to maintian and update.

Why not use what Stardew Valley already provides: its own game install content?

Using tools like `StardewXnbHack` - or other available XNB unpackers - we can gather this data and keep it up-to-date as new patches are available with much more precision.

### Tasks

- [x] Unpack data from SDV game content
- [x] Update builder scripts to parse the unpacked content and generate usable data for the bot
- Get data from more categories:
  - [] NPC Schedules
  - [] In-game Events
  - [x] Crops
  - [] Items
    - [] Crops/food
    - [] Foraging
    - [] Minerals
    - [] Equipment
    - [] Fish
  - [] Fishing
  - [] Cooking
- [] Incorporate unpacked sprites for usage throughout the bot
  - Avatars
  - Item icons
  - Animals
  - Fish

## 💬 Slash Commands

### Summary

Incorporate Discord's "slash commands" API, so users can type `/gunther` and navigate through the Discord UI directly to use our commands.

### Tasks

- [] Conduct research on what is needed for this
- [] Add slash command usage to the bot
- [] (Optional) Make usage of the bot exclusively through slash commands?

### Research Notes

- Is this documented in the Discord.js docs?
- Does the `sapphire` framework handle this currently?
- How much different is it from how commands are handled currently?
- Are there requirements to moving to this methodology?

## 🐛 Known Bugs

> **Universal liked/disliked gifts are overriding NPCs personal preferences.**
>
> - e.g.: "Driftwood" appears as a disliked gift for Leah, but she actually likes this as a gift.
> - This needs to be addressed in the build script, where it constructs the `SDVGifts` object per character.
