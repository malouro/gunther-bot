import type { Config } from '@jest/types'
import config from './jest.config'

export default {
	...config,
	collectCoverageFrom: [...config.collectCoverageFrom, 'src/**/*.ts'],
} as Config.InitialOptions
