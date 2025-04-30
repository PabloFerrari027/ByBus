import { NotificationStrategy } from '@/application/strategies/notification-strategy.js';
import { NotificationsProvider as INotificationsProvider } from '@/application/ports/providers/notifications-provider.js';

export class InMemoryNotificationsProvider extends INotificationsProvider {
	constructor(private readonly notificationStrategy: NotificationStrategy) {
		super(notificationStrategy);
	}

	async send(to: string, subject: string, body: string): Promise<void> {
		await this.notificationStrategy.send(to, subject, body);
	}
}
