import { Objects as ObjectsL10nJson } from '@/utils/l10n/translations'

export const L10N_PATTERN = /\[LocalizedText Strings\\([A-Za-z]*):([A-Za-z_]*)/

const Mappings = {
	Objects: ObjectsL10nJson,
}

function localizer(input: string): string | undefined {
	const matches = input.match(L10N_PATTERN)

	if (!matches || matches.length <= 1) {
		return undefined
	}

	const category = matches[1] ?? 'NULL'
	const key = matches[2] ?? 'NULL'

	if (!(category in Mappings)) {
		console.warn(
			`WARN: Could not find category for "${category}". (input: "${input}")`
		)
		return undefined
	}

	const returnValue = Mappings[category]?.[key]

	if (typeof returnValue !== 'string') {
		console.warn(
			`WARN: Could not find localized string for "${key}". (input: "${input}"`
		)
		return undefined
	}

	return returnValue
}

export default localizer
