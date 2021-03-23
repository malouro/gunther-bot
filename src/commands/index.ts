import groups from './groups'
export { groups }

import GitCommand from './meta/git'
import CharacterCommand from './stardew/character'
import CalendarCommand from './stardew/calendar'
import WikiCommand from './stardew/wiki'

export default [
	/* Meta Commands */
	GitCommand,
	/* Stardew Commands */
	CharacterCommand,
	CalendarCommand,
	WikiCommand,
]
