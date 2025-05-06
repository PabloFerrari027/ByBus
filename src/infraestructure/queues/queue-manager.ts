import { NotifyPasswordChangeEvent } from '@/application/event-handlers/notify-password-change-event.js';
import { SendWelcome } from '@/application/event-handlers/send-welcome.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';
import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { PasswordChangeEvent } from '@/domain/events/password-change-event.js';

export class QueueManager {
	constructor(
		private readonly queuesProvider: QueuesProvider,
		private readonly notificationsProvider: NotificationsProvider,
		private readonly usersRepository: UsersRepository,
		private readonly templateRepository: TemplateRepository,
		private readonly loggerProvider: LoggerProvider,
	) {}

	public async registerAll() {
		const usersQueue = await this.queuesProvider.create('users');
		const sendWelcome = new SendWelcome(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.loggerProvider,
		);
		const notifyPasswordChangeEvent = new NotifyPasswordChangeEvent(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.loggerProvider,
		);
		usersQueue.subscribe(CreatedUserEvent.key, sendWelcome);
		usersQueue.subscribe(PasswordChangeEvent.key, notifyPasswordChangeEvent);
	}
}
