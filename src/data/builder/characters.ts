import { existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import * as prettier from 'prettier'
import sharp from 'sharp'

import { SDVCharacterData, SDVCharacterName, SDVGifts } from '@/data/types'
import { getWikiUrl } from '@/utils'
import localizer from '@/utils/l10n/localizer'
import { autoGenWarning } from '.'

import CharactersJson from '@/data/json/Characters.json'
import ObjectJson from '@/data/json/Objects.json'
import GiftTastes from '@/data/json/NPCGiftTastes.json'

const AVATAR_WIDTH = 64
const AVATAR_HEIGHT = 64
const AVATAR_BASE_URL =
	'https://raw.githubusercontent.com/malouro/gunther-bot/refs/heads/main/src/data/img/avatars'

/**
 * @TODO
 * - Incorporate handling of "trinkets" as gifts
 * - Handle item categories
 * - Get avatar data from somewhere.
 * 	- Wiki
 * 	- png from unpacked data + image processing
 */

/**
 * Given a string of space separated item IDs,
 * give an array of item names.
 * @param ids
 */
function getGiftArray(ids: string[]): string[] {
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

/**
 * @param name Character name
 * @param personalTastes List of gift IDs for the character's personal tastes
 * @returns Returns full list of the NPC's gift tastes, with item names
 */
function buildGiftTastes(
	name: SDVCharacterName,
	personalTastes: SDVGifts
): SDVGifts {
	const giftIds: SDVGifts = {
		love: [],
		like: [],
		neutral: [],
		dislike: [],
		hate: [],
	}

	for (const giftType in personalTastes) {
		giftIds[giftType].push(...personalTastes[giftType])
	}

	;[
		GiftTastes.Universal_Love,
		GiftTastes.Universal_Like,
		GiftTastes.Universal_Neutral,
		GiftTastes.Universal_Dislike,
		GiftTastes.Universal_Hate,
	].forEach((universalTaste, index) => {
		const ids = universalTaste.split(' ')
		for (const id of ids) {
			if (
				!Object.keys(giftIds).some(giftType => giftIds[giftType].includes(id))
			) {
				giftIds[Object.keys(giftIds)[index]].push(id)
			}
		}
	})

	return {
		love: [...getGiftArray(giftIds.love)],
		like: [...getGiftArray(giftIds.like)],
		neutral: [...getGiftArray(giftIds.neutral)],
		dislike: [...getGiftArray(giftIds.dislike)],
		hate: [...getGiftArray(giftIds.hate)],
	}
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

	for (const key in CharactersJson) {
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

		const gifts = buildGiftTastes(name as SDVCharacterName, {
			love: lovedGifts.split(' '),
			like: likedGifts.split(' '),
			neutral: neutralGifts.split(' '),
			dislike: dislikedGifts.split(' '),
			hate: hatedGifts.split(' '),
		})

		/**
		 * Avatar setup:
		 * - Grab portrait tile sheet
		 * - Crop top left image - this will be the main avatar
		 *	 - Use `image-js` for this?
		 * - Save avatar to ./src/data/img/avatars/{character}
		 * - Use URL to GitHub raw content (if possible?)
		 */

		// TODO: Consider moving avatar generator into its own builder
		// Makes it easier to clean up with reset-indexes and allow separate exec

		// default avatar URL if we can't generate one for some reason
		let avatar =
			'https://stardewvalleywiki.com/mediawiki/images/6/68/Main_Logo.png'
		const rawPortraitFile = `unpacked_data/Content (unpacked)/Portraits/${name}.png`

		if (existsSync(path.resolve(__dirname, '../../../', rawPortraitFile))) {
			try {
				const img = sharp(rawPortraitFile).extract({
					left: 0,
					top: 0,
					width: AVATAR_WIDTH,
					height: AVATAR_HEIGHT,
				})
				await img.toFile(`src/data/img/avatars/${name}.png`)
			} catch (error) {
				console.error('Error generating avatar:', error)
			}
			avatar = `${AVATAR_BASE_URL}/${name}.png`
		}

		const characterData: SDVCharacterData = {
			name,
			gifts,
			birthday: `${birthdaySeason} ${birthdayDay}`,
			birthdayDay: birthdayDay.toString(),
			birthdaySeason,
			bestGifts: gifts.love,
			avatar,
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
