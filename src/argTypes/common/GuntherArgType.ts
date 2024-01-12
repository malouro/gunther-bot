import { Argument, ArgumentType, CommandoMessage } from 'discord.js-commando'
import { GuntherClient } from '@/bot'

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

export default abstract class GuntherArgType extends ArgumentType {
	constructor(client: GuntherClient, id: GuntherArgTypeKeys) {
		super(client, id)
	}
	parse(
		val: string,
		msg: CommandoMessage,
		arg: Argument
	): GuntherArgValue | Promise<unknown> {
		return ArgumentType.prototype.parse(val, msg, arg)
	}
	validate(
		val: string,
		msg: CommandoMessage,
		arg: Argument
	): boolean | string | Promise<boolean | string> {
		return ArgumentType.prototype.validate(val, msg, arg)
	}
}
