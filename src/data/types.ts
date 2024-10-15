import { Crops } from '@/data'

// ------------------------------------------------------------
// Characters
// ------------------------------------------------------------
export interface SDVCharacterData {
	name: string
	avatar: string
	gender: Gender
	birthday: string
	birthdaySeason: SDVSeason
	birthdayDay: SDVDayOfSeason
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
] as Readonly<string[]>
export type SDVCharacterDataField = (typeof characterDataFields)[number]
export type Gender = 'Male' | 'Female' | 'Undefined'

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
// #region
export interface SDVCrop {
	/** Name of the crop, and the harvested item. (ie: "Parsnip") */
	name: string
	/** ID of the crop. */
	id: number
	/** Seasons that you can grow the crop. */
	seasons: SDVSeason[]
	/** Min number you can harvest. */
	harvestMin: number
	/** Max number you can harvest at a time. */
	harvestMax: number
	/** Is it a trellis crop? */
	trellisCrop: boolean
	/** Is it a paddy crop? */
	paddyCrop: boolean
	/** How many days it takes to grow? */
	growth: number
	/** Does the crop regrow for harvest again? */
	regrow: boolean
	/** How long does the regrowth take? */
	regrowDays: number
	/** How much does the harvested crop sell for? */
	sellPrice: number
}

export const SDVCropList = Object.keys(Crops)
export type SDVCropName = (typeof SDVCropList)[number]
// #endregion
