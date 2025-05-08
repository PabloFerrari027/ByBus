import { NotificationDTO } from '@/application/dtos/notification-dto.js';
import { NotificationsProvider as INotificationsProvider } from '@/application/ports/providers/notifications-provider.js';

export class ConsoleNotificationsProvider extends INotificationsProvider {
	async send(data: NotificationDTO): Promise<void> {
		console.log(
			`Sending email to ${data.to} with subject "${data.subject}" and body "${data.body}"`,
		);
	}
}
