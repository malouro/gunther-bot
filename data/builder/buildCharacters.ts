import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

import getCharacterData from './wiki-parser/getCharacterData'

import { SDVCharacterName, SDVCharacterList } from '../structure'
import { getWikiUrl } from '../../src/utils'
import { inTestMode, autoGenWarning } from './'

export default async function buildCharacters(
	characters: ReadonlyArray<SDVCharacterName> = SDVCharacterList
): Promise<void> {
	if (inTestMode) {
		return console.log(
			getCharacterData(
				fs.readFileSync(
					path.resolve(__dirname, './test_fixtures/Marnie.txt'),
					'utf-8'
				)
			)
		)
	}

	let exports = ''

	for (const character of characters) {
		const characterWiki = await fetch(getWikiUrl(character))
		const wikiHtml = await characterWiki.text()
		const characterData = getCharacterData(wikiHtml)

		exports += `import ${characterData.name} from './${characterData.name}.json'\nexport { ${characterData.name} }\n`

		fs.writeFileSync(
			path.resolve(__dirname, `./characters/${character}.json`),
			JSON.stringify(characterData)
		)
	}

	fs.writeFileSync(
		path.resolve(__dirname, './characters/index.ts'),
		`${autoGenWarning}\n\n${exports}`
	)
}
