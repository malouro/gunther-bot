import { Client } from 'discord.js-commando'
import GuntherClient from './client'

describe('Gunther Client', () => {
	let testClient: GuntherClient = null

	beforeAll(() => {
		testClient = new GuntherClient()
	})

	afterAll(() => {
		testClient.destroy()
	})

	test('is a client', () => {
		expect(testClient).toBeInstanceOf(Client)
	})

	test('has special Gunther attributes', () => {
		expect(testClient.fetch).toBeInstanceOf(Function)
		expect(testClient.cacheManager).toBeTruthy()
		expect(testClient.logger.log).toBeInstanceOf(Function)
	})
})
