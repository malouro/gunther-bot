import { GuntherClient } from '../bot'

export default function Ready(client: GuntherClient): void {
	client.logger.log({
		level: 'info',
		message: 'Now online!',
	})
}
