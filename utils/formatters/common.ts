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
