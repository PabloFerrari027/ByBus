import { UsersRepository } from '../ports/repositories/users-repository.js';
import { Handler } from '../../shared/core/queues/handler.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { User } from '@/domain/entities/user.js';
import { NotificationsProvider } from '../ports/providers/notifications-provider.js';
import { NotificationService } from '../services/notification-service.js';
import { TemplateRepository } from '../ports/repositories/templates-repository.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';

export class NotifyPasswordChangeEvent extends Handler {
	private user: User | null;

	constructor(
		private readonly notificationsProvider: NotificationsProvider,
		private readonly usersRepository: UsersRepository,
		private readonly templateRepository: TemplateRepository,
		private readonly loggerProvider: LoggerProvider,
	) {
		super();
		this.user = null;
	}

	async execute(event: CreatedUserEvent) {
		this.user = await this.usersRepository.findById(event.data.userId.value);

		if (!this.user) {
			this.loggerProvider.error(`User not found when trying to send welcome email`, {
				userId: event.data.userId,
			});

			return;
		}
		const notificationService = new NotificationService(this.templateRepository);

		const message = await notificationService.getMessage('PASSWORD-CHANGE', {
			userName: this.user.name.value,
		});

		await this.notificationsProvider.send(this.user.email.value, message.subject, message.body);
	}
}
