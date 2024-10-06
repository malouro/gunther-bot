import { writeFileSync } from 'node:fs'
import path from 'node:path'
import * as prettier from 'prettier'

import { SDVCharacterData, SDVCharacterName } from '@/data/types'
import { getWikiUrl } from '@/utils'
import { autoGenWarning } from '.'

import CharactersJson from '@/data/json/Characters.json'
import ObjectJson from '@/data/json/Objects.json'
import GiftTastes from '@/data/json/NPCGiftTastes.json'

import ObjectL10nJson from '@/utils/l10n/translations/Objects.json'
import localizer from '@/utils/l10n/localizer'

const L10N_PREFIX = '[LocalizedText Strings\\Objects:'
const L10N_SUFFIX = ']'

/**
 * @TODO
 * - Incorporate handling of "trinkets" as gifts
 * - Add localizer method
 * - Get avatar data from somewhere.
 * 	- Wiki
 * 	- png from unpacked data + image processing
 */

/**
 * Given a string of space separated item IDs,
 * give an array of item names.
 * @param input
 */
function getGiftArray(input: string): string[] {
	const ids = input.split(' ')
	const output = []

	for (const id of ids) {
		if (Number(id) < 0) {
			continue
		}

		if (id in ObjectJson) {
			const lookup = ObjectJson[id].DisplayName
			const translatedText = localizer(lookup)

			if (translatedText) {
				output.push(translatedText)
			}
		}
	}
	return output
}

// characters to skip; they don't matter for the bot
const excludeCharacters = [
	'Marlon',
	'???',
	'Bear',
	'Birdie',
	'Bouncer',
	'Gil',
	'Governor',
	'Grandpa',
	'Gunther',
	'Henchman',
	'Mister Qi',
	'Morris',
	'Old Mariner',
	'Welwick',
]

export default async function (): Promise<void> {
	let indexContent = autoGenWarning + '\n\n'

	for (const key of Object.keys(CharactersJson)) {
		const name = key

		if (excludeCharacters.includes(name)) {
			continue
		}

		console.info('Generating character data for ', name)

		const {
			Gender: gender,
			BirthSeason: birthdaySeason,
			BirthDay: birthdayDay,
			CanBeRomanced: canMarry,
		} = CharactersJson[key]

		const [
			_loveMessage,
			lovedGifts,
			_likeMessage,
			likedGifts,
			_neutralMessage,
			neutralGifts,
			_dislikeMessage,
			dislikedGifts,
			_hateMessage,
			hatedGifts,
			_birthdayMessage,
		] = (GiftTastes[name] as SDVCharacterName).split('/')

		const characterData: SDVCharacterData = {
			name,
			gifts: {
				love: [
					...getGiftArray(GiftTastes.Universal_Love),
					...getGiftArray(lovedGifts),
				],
				like: [
					...getGiftArray(GiftTastes.Universal_Like),
					...getGiftArray(likedGifts),
				],
				neutral: [
					...getGiftArray(GiftTastes.Universal_Neutral),
					...getGiftArray(neutralGifts),
				],
				dislike: [
					...getGiftArray(GiftTastes.Universal_Dislike),
					...getGiftArray(dislikedGifts),
				],
				hate: [
					...getGiftArray(GiftTastes.Universal_Hate),
					...getGiftArray(hatedGifts),
				],
			},
			birthday: `${birthdaySeason} ${birthdayDay}`,
			birthdayDay: birthdayDay.toString(),
			birthdaySeason,
			bestGifts: getGiftArray(lovedGifts),
			// temporarily set the avatar so the embeds work
			avatar: 'https://stardewvalleywiki.com/mediawiki/images/3/3d/Gunther.png',
			canMarry,
			gender,
			wiki: getWikiUrl(name),
		}

		const codeSafeName = name
		const fileContent = `${autoGenWarning}

import { SDVCharacterData } from '@/data/types'

export default ${JSON.stringify(characterData, null, '\t')} as SDVCharacterData
`
		writeFileSync(
			path.resolve(__dirname, `../characters/${codeSafeName}.ts`),
			// prettier it, in case something f***s up
			await prettier.format(fileContent, {
				semi: false,
				parser: 'typescript',
				useTabs: true,
				singleQuote: true,
			})
		)

		indexContent += `import ${codeSafeName} from './${codeSafeName}'
export { ${codeSafeName} }
`
	}

	writeFileSync(path.resolve(__dirname, '../characters/index.ts'), indexContent)
}
