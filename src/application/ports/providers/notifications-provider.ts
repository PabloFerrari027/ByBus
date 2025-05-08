import { NotificationDTO } from '@/application/dtos/notification-dto.js';

export abstract class NotificationsProvider {
	abstract send(data: NotificationDTO): Promise<void>;
}
