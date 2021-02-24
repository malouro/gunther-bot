// ------------------------------------------------------------
// Characters
// ------------------------------------------------------------
export type SDVCharacterData = {
	name: string
	avatar: string
	birthday: string
	bestGifts: Array<string>
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
]
export type SDVCharacterName = typeof SDVCharacterList[number]

// ------------------------------------------------------------
// Calendar
// ------------------------------------------------------------
export type Event = string
export type DayOfWeek =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday'
export type DayOfSeason =
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
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter'
export type SeasonShorthand = 'sp' | 'su' | 'f' | 'fa' | 'w' | 'wi'
export const daysOfWeek: ReadonlyArray<DayOfWeek> = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
]
export const daysOfSeason: ReadonlyArray<DayOfSeason> = [
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
export const seasons: ReadonlyArray<Season> = [
	'Spring',
	'Summer',
	'Fall',
	'Winter',
]
export const seasonShorthands: ReadonlyArray<SeasonShorthand> = [
	'sp',
	'su',
	'fa',
	'f',
	'wi',
	'w',
]

export type SDVCalendarDate = {
	season: Season
	day: DayOfSeason
	dayOfWeek?: DayOfWeek
}
export type SDVCalendarDay = {
	date: SDVCalendarDate
	birthdays: Array<SDVCharacterName>
	events: Array<Event>
}
export type SDVCalendarSeason = {
	days: {
		[key in DayOfSeason]?: SDVCalendarDay
	}
	image: string
	wiki: string
	events: Array<Event>
	birthdays: Array<SDVCharacterName>
}
export type SDVCalendarData = {
	[key in Season]?: SDVCalendarSeason
}
