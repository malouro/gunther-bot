import { GuntherClient } from '@/bot'

export default function Ready(client: GuntherClient): void {
	client.logger.info('Now online!')
}
