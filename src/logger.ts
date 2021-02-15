import {
	createLogger,
	format,
	transports,
	addColors
} from 'winston'
import { AbstractConfigSetLevels, AbstractConfigSetColors } from 'winston/lib/winston/config'

/**
 * @todo Make this a config somewhere
 */
const TIMESTAMP_ENABLED = true
const LOG_LEVEL_ICON_ENABLED = false

type AbstractConfigLogIcons = {
	[key: string]: string;
}

export const logIcons: AbstractConfigLogIcons = {
	error: '❌',
	warn:  '⚠',
	info:  'ℹ',
	debug: '🧪'
}

export const logColors: AbstractConfigSetColors = {
	error: 'bold black redBG',
	warn: 'bold black orangeBG',
	info: 'bold blue',
	debug: 'bold purple'
}

export const getIconForLogLevel = (level: string): string => logIcons[
	Object.keys(logLevels).find(levelName => level.includes(levelName))
]

export const logFormatting = format.printf(
	({ message, timestamp: logTimestamp, level }) =>
		`${TIMESTAMP_ENABLED
			? `(${logTimestamp}) `
			: ''
		}${LOG_LEVEL_ICON_ENABLED
			? getIconForLogLevel(level)
			: level
		} - ${message}`
)

export const logLevels: AbstractConfigSetLevels = {
	error: 0,
	warn:  1,
	info:  2,
	debug: 3
}

addColors(logColors)

const GuntherLogger = createLogger({
	format:
		format.combine(
			format.colorize(),
			format.timestamp({ format: 'HH:mm:ss.SSS' }),
			logFormatting
		),
	levels: logLevels,
	transports: [new transports.Console()]
})

export default GuntherLogger
