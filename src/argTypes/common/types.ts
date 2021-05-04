
/** Key name identifiers for Gunther ArgTypes */
export type GuntherArgTypeKeys =
	'sdv-character' |
	'sdv-date'      |
	'sdv-gift-type' |
	'sdv-season'    |
	null

/** Return value for parse() method in Gunther ArgTypes */
export type GuntherArgValue<T> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: T | any,
	type: GuntherArgTypeKeys
}
