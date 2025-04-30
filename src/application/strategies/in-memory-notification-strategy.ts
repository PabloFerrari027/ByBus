import { NotificationStrategy } from './notification-strategy.js';

export class InMemoryNotificationStrategy extends NotificationStrategy {
	async send(to: string, subject: string, body: string): Promise<void> {
		console.log(`Sending email to ${to} with subject "${subject}" and body "${body}"`);
	}
}
