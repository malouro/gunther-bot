import { capitalize } from '@/utils/formatters/common'

/**
 *
 * @param searchTerm Search term to properly format
 */
export function formatWikiTerm(searchTerm: string): string {
	return searchTerm
		.split(/\s/)
		.map(word => capitalize(word))
		.join('_')
}
