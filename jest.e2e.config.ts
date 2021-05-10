import type { Config } from '@jest/types'
import config from './jest.config'

export default {
	...config,
	collectCoverageFrom: ['data/**/*.ts', 'src/**/*.ts'],
} as Config.InitialOptions
