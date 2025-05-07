import { NotificationsProvider as INotificationsProvider } from '@/application/ports/providers/notifications-provider.js';

export class ConsoleNotificationsProvider extends INotificationsProvider {
	async send(to: string, subject: string, body: string): Promise<void> {
		console.log(`Sending email to ${to} with subject "${subject}" and body "${body}"`);
	}
}
