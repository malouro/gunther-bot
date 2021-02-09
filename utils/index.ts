/**
 * @param term Search term to get Wiki URL from
 */
export function getWikiUrl(term: string): string {
  return `https://stardewcommunitywiki.com/${term}`
}

export function formatCharacterName(name: string): string {
  return `${name.charAt(0).toLocaleUpperCase()}${name.slice(1).toLocaleLowerCase()}`
}
