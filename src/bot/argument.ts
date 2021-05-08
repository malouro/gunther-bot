import { ArgumentType } from 'discord.js-commando'
import GuntherClient from './client'

/** Key name identifiers for `GuntherArgType`s */
export type GuntherArgTypeKeys =
	| 'sdv-character'
	| 'sdv-character-prop'
	| 'sdv-date'
	| 'sdv-gift-type'
	| 'sdv-season'

/** Return value for `parse()` method in `GuntherArgType`s */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GuntherArgValue<V = any> = {
	value: V
	type: GuntherArgTypeKeys | null
}

export declare abstract class GuntherArgType extends ArgumentType {
	public constructor(client: GuntherClient, id: GuntherArgTypeKeys)
	public readonly client: GuntherClient
	public id: GuntherArgTypeKeys
}
