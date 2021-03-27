import type { Config } from '@jest/types'

const ignoreDirectories = ['node_modules', 'examples', 'coverage']

const config: Config.InitialOptions = {
	preset: 'ts-jest',
	testEnvironment: 'node',

	testPathIgnorePatterns: ignoreDirectories,
	watchPathIgnorePatterns: ignoreDirectories
}

export default config
