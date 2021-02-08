import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { getCharacterData } from './dataFetcher'
import { getWikiUrl } from '../utils'
import { CharacterList, CharacterName } from './structs'

async function buildCharacters(characters?: Array<CharacterName> | typeof CharacterList): Promise<void> {
  if (!characters) {
    characters = CharacterList
  }

  let exports = ''

  for (const character of characters) {
    const characterWiki = await fetch(getWikiUrl(character))
    const data = await characterWiki.text()
    const characterData = getCharacterData(data)

    exports += `import ${characterData.name} from './${characterData.name}.json'\nexport {${characterData.name}}\n`

    fs.writeFileSync(
      path.resolve(__dirname, `./characters/${character}.json`),
      JSON.stringify(characterData)
    )
  }

  fs.writeFileSync(
    path.resolve(__dirname, './characters/index.ts'),
    exports
  )
}

if (process.env.NODE_ENV === 'test') {
  // Test data
  console.log(
    getCharacterData(
      fs.readFileSync(
        path.resolve(__dirname,`./test_structures/${process.env.NPC}.txt`),
        'utf-8'
      )
    )
  )
} else {
  buildCharacters()
}
