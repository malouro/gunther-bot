import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { getCharacterData } from './dataFetcher'
import { getWikiUrl } from '../utils'
import { CharacterList } from './structs'

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
}

type CharacterName = typeof CharacterList[number]

function buildCharacters(characters?: Array<CharacterName> | typeof CharacterList): void {
  if (!characters) {
    characters = CharacterList
  }
  characters.forEach((character) => {
    fetch(getWikiUrl(character))
    .then(async content => {
      const data = await content.text()

      fs.writeFileSync(
        path.resolve(__dirname, `./characters/${character}.json`),
        JSON.stringify(getCharacterData(data))
      )
    })
    .catch((error) => {
      throw error
    })
  })
}

buildCharacters()
