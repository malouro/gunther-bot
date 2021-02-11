import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { getCharacterData } from './dataParser'
import { getWikiUrl } from '../utils'
import { SDVCharacterList, SDVCharacterName } from './structs'

export async function buildCharacters(characters?: Array<SDVCharacterName> | typeof SDVCharacterList): Promise<void> {
	if (!characters) {
		characters = SDVCharacterList
	}

	let exports = ''

	for (const character of characters) {
		const characterWiki = await fetch(getWikiUrl(character))
		const data = await characterWiki.text()
		const characterData = getCharacterData(data)

		exports += `import ${characterData.name} from './${characterData.name}.json'\nexport { ${characterData.name} }\n`

		fs.writeFileSync(
			path.resolve(__dirname, `./characters/${character}.json`),
			JSON.stringify(characterData)
		)
	}

	fs.writeFileSync(
		path.resolve(__dirname, './characters/index.ts'),
		'/* WARNING: This file is auto-generated at build time. Do not edit manually. */\n\n' + exports
	)
}

if (process.env.NODE_ENV === 'test') {
	// Test data
	console.log(
		getCharacterData(
			fs.readFileSync(
				path.resolve(__dirname,`./test_fixtures/${process.env.NPC || 'Marnie'}.txt`),
				'utf-8'
			)
		)
	)
} else {
	buildCharacters()
}
