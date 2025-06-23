import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { NotificationService } from '@/application/services/notification-service.js';
import { User } from '@/domain/entities/user.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { Handler } from '@/shared/core/queues/handler.js';

interface Input {
	userId: UUID;
	sessionId: UUID;
}

export class SendWelcomeHandler extends Handler {
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

	async execute(input: Input) {
		this.user = await this.usersRepository.findById(input.userId.value);

		if (!this.user) {
			this.loggerProvider.error({
				message: `User not found when trying to send welcome email`,
				meta: { userId: input.userId.value },
			});
			return;
		}

		const notificationService = new NotificationService(this.templateRepository);

		const message = await notificationService.getMessage('welcome', {
			userName: this.user.name.value,
		});

		await this.notificationsProvider.send({
			to: this.user.email.value,
			subject: message.subject,
			body: message.body,
		});
	}
}
