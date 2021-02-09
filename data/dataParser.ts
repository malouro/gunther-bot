import cheerio from 'cheerio'
import { getWikiUrl } from '../utils'
import { CharacterData } from './structs'

/**
 * Generate a character data object based on fetched Wiki HTML
 * @param {string} html HTML content as string
 */
export function getCharacterData(html: string): CharacterData {
  const $ = cheerio.load(html)
  const characterName = $('h1').text().trim()

  // Common selectors
  const infoBoxSection = '#infoboxsection'
  const infoBoxDetail = '#infoboxdetail'

  /**
   * Get data from the side info box section
   * @param {string} fieldName Name of field to look for in info box
   */
  function getInfoBoxData(fieldName) {
    return $(infoBoxSection)
      .filter((_, element) => $(element).text().includes(fieldName))
      .next(infoBoxDetail)
  }

  const gifts = []

  $(getInfoBoxData('Best Gifts'))
      .find('a')
      .each((_, gift) => gifts.push($(gift).text().toString().trim()))

  return {
    name: characterName,
    wiki: getWikiUrl(characterName),
    birthday: getInfoBoxData('Birthday').text().trim(),
    bestGifts: gifts,
    canMarry: Boolean(getInfoBoxData('Marriage').text().trim().toLowerCase() === 'yes')
  }
}
