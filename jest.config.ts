import type { Config } from '@jest/types'

const ignoreDirectories = [
	'node_modules',
	'examples',
	'coverage',
	'cjs',
	'esm',
	'.cache',
]

const config: Config.InitialOptions = {
	preset: 'ts-jest',
	testEnvironment: 'node',

	testPathIgnorePatterns: ignoreDirectories,
	watchPathIgnorePatterns: ignoreDirectories,
	modulePathIgnorePatterns: ignoreDirectories.slice(1),
}

export default config
