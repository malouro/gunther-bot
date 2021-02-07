import cheerio from 'cheerio'
import { getWikiUrl } from '../utils'

/**
 * Generate a character data object based on fetched Wiki HTML
 * @param {string} html HTML content as string
 */
export function getCharacterData(html: string): Record<string, unknown> {
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

  return {
    name: characterName,
    wiki: getWikiUrl(characterName),
    birthday: getInfoBoxData('Birthday').text().trim(),
    bestGifts: $(getInfoBoxData('Best Gifts'))
      .find('a')
      .map((_, gift) => $(gift).text().trim())
      .toArray(),
    canMarry: Boolean(getInfoBoxData('Marriage').text().trim().toLowerCase() === 'yes')
  }
}

