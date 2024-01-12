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

	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@/data/(.*)$': '<rootDir>/data/$1',
		'^@/data': '<rootDir>/data/index',
	},

	collectCoverageFrom: [
		'src/utils/**/*.ts',
		'data/**/*.ts',
		'data/builder/wiki-parser/**/*.ts',
		'!data/builder/*.ts',
	],
	testPathIgnorePatterns: ignoreDirectories,
	watchPathIgnorePatterns: ignoreDirectories,
	modulePathIgnorePatterns: ignoreDirectories.slice(1),
}

export default config
