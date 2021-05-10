import { checkDate, getDate, GuntherArgType, GuntherArgValue } from './common'
import { SDVCalendarDate } from '../../data/structure'
import { GuntherClient } from '../bot'

export default class DateArgType extends GuntherArgType {
	constructor(client: GuntherClient) {
		super(client, 'sdv-date')
	}

	parse(val: string): GuntherArgValue<SDVCalendarDate> {
		const { day, season } = getDate(val)

		return {
			value: { day, season },
			type: 'sdv-date',
		}
	}

	validate(val: string): boolean {
		return checkDate(val)
	}
}
