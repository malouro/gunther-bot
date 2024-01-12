import GuntherClient from './client'
import GuntherCommand from './command'

describe('Gunther Command', () => {
	const mockRunFn = jest.fn()
	class TestCommand extends GuntherCommand {
		constructor(client: GuntherClient) {
			super(client, {
				name: 'test-command',
				group: 'test',
				memberName: 'test-command',
				description: 'Just for testing ;)',
			})
		}
		run = mockRunFn
	}

	const testClient = new GuntherClient()

	afterAll(() => {
		testClient.destroy()
	})

	test('making new Gunther Command works', () => {
		const DerivedTestCommand = new TestCommand(testClient)

		expect(DerivedTestCommand).toBeInstanceOf(GuntherCommand)
	})

	test('run method triggers on run', () => {
		const DerivedTestCommand = new TestCommand(testClient)

		DerivedTestCommand.run()

		expect(mockRunFn).toHaveBeenCalled()
	})
})
