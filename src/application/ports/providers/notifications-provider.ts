import { NotificationStrategy } from '@/application/strategies/notification-strategy.js';

export abstract class NotificationsProvider {
	constructor(private readonly notificationtrategy: NotificationStrategy) {}
	abstract send(to: string, subject: string, body: string): Promise<void>;
}
