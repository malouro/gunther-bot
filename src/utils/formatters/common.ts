/**
 * Given a string, return in <upperCase><...lowerCase> format
 * ie: apple -> Apple, or oRANgE -> Orange
 * @param str String to format
 */
export function capitalize(str: string): string {
	return `${str.charAt(0).toLocaleUpperCase()}${str
		.slice(1)
		.toLocaleLowerCase()}`
}

/**
 * Format an array into a list (string of bulleted items)
 * @param {string[]} input Array of items to format into list
 * @returns string
 */
export function makeList(input: string[]): string {
	return input.map(str => `• ${str}`).join('\n')
}
