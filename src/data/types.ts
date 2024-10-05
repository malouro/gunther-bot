// ------------------------------------------------------------
// Characters
// ------------------------------------------------------------
export type SDVCharacterData = {
	name: string
	avatar: string
	birthday: string
	bestGifts: Array<string>
	gifts: SDVGifts
	canMarry: boolean
	wiki: string
}
export const SDVCharacterList = [
	'Alex',
	'Elliott',
	'Harvey',
	'Sam',
	'Sebastian',
	'Shane',
	'Abigail',
	'Emily',
	'Haley',
	'Leah',
	'Maru',
	'Penny',
	'Caroline',
	'Clint',
	'Demetrius',
	'Dwarf',
	'Evelyn',
	'George',
	'Gus',
	'Jas',
	'Jodi',
	'Kent',
	'Krobus',
	'Leo',
	'Lewis',
	'Linus',
	'Marnie',
	'Pam',
	'Pierre',
	'Robin',
	'Sandy',
	'Vincent',
	'Willy',
	'Wizard',
] as const
export type SDVCharacterName = (typeof SDVCharacterList)[number]
export type SDVGifts = {
	[key in SDVGiftTypes]?: Array<string>
}
export type SDVGiftTypes = 'love' | 'like' | 'dislike' | 'neutral' | 'hate'

export const giftTypes = ['love', 'like', 'dislike', 'neutral', 'hate']
export const characterDataFields = [
	'name',
	'avatar',
	'birthday',
	'bestGifts',
	'canMarry',
	'gifts',
	'wiki',
] as const
export type SDVCharacterDataField = (typeof characterDataFields)[number]

// ------------------------------------------------------------
// Calendar
// ------------------------------------------------------------
// #region
export type SDVEvent = string
export type SDVDayOfWeek =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday'
export type SDVDayOfSeason =
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25'
	| '26'
	| '27'
	| '28'
export type SDVSeason = 'Spring' | 'Summer' | 'Fall' | 'Winter'
export type SDVSeasonShorthand = 'sp' | 'su' | 'f' | 'fa' | 'w' | 'wi'
export const daysOfWeek: ReadonlyArray<SDVDayOfWeek> = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
]
export const daysInAWeek = daysOfWeek.length
export const daysOfSeason: ReadonlyArray<SDVDayOfSeason> = [
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
	'24',
	'25',
	'26',
	'27',
	'28',
]
export const daysInASeason = daysOfSeason.length
export const seasons: ReadonlyArray<SDVSeason> = [
	'Spring',
	'Summer',
	'Fall',
	'Winter',
]
export const seasonShorthands: ReadonlyArray<SDVSeasonShorthand> = [
	'sp',
	'su',
	'fa',
	'f',
	'wi',
	'w',
]

export type SDVCalendarDate = {
	season: SDVSeason
	day: SDVDayOfSeason
	dayOfWeek?: SDVDayOfWeek
}
export type SDVCalendarDay = {
	date: SDVCalendarDate
	birthdays: Array<SDVCharacterName>
	events: Array<SDVEvent>
}
export type SDVCalendarSeason = {
	days: {
		[key in SDVDayOfSeason]?: SDVCalendarDay
	}
	image: string
	wiki: string
	events: Array<SDVEvent>
	birthdays: Array<SDVCharacterName>
}
export type SDVCalendarData = {
	[key in SDVSeason]?: SDVCalendarSeason
}
// #endregion

// ------------------------------------------------------------
// Crops
// ------------------------------------------------------------

export interface SDVCrop {
	name: string
	id: number
	seasons: SDVSeason[]
	harvestMin: number
	harvestMax: number
	trellisCrop: boolean
	paddyCrop: boolean
	regrow: boolean
	regrowDays: number
	sellPrice: number
}
