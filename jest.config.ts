import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	// testMatch: ['**/*.test.ts'],
	preset: 'ts-jest',
  testEnvironment: 'node',
}

export default config
