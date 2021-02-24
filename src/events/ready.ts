import { GuntherClient } from '../bot/client'

export default function Ready(client: GuntherClient): void {
	client.logger.log({
		level: 'info',
		message: 'Now online!',
	})
}
