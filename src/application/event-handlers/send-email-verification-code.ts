import { UsersRepository } from '../ports/repositories/users-repository.js';
import { Handler } from '../../shared/core/queues/handler.js';
import { User } from '@/domain/entities/user.js';
import { NotificationsProvider } from '../ports/providers/notifications-provider.js';
import { NotificationService } from '../services/notification-service.js';
import { TemplateRepository } from '../ports/repositories/templates-repository.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { ENVProvider } from '../ports/providers/env-provider.js';
import { UserVerificationCodeRepository } from '../ports/repositories/user-verification-code-repository.js';
import { UserVerificationCode } from '@/domain/entities/user-verification-code.js';
import { randomInt } from 'crypto';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';

export class SendEmailVerificationCode extends Handler {
	private user: User | null;

	constructor(
		private readonly notificationsProvider: NotificationsProvider,
		private readonly usersRepository: UsersRepository,
		private readonly templateRepository: TemplateRepository,
		private readonly ENVProvider: ENVProvider,
		private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
		private readonly loggerProvider: LoggerProvider,
	) {
		super();
		this.user = null;
	}

	async execute(event: CreatedUserEvent) {
		this.user = await this.usersRepository.findById(event.data.userId.value);

		if (!this.user) {
			this.loggerProvider.error({
				message: `User not found when trying to send welcome email`,
				meta: { userId: event.data.userId },
			});
			return;
		}

		const notificationService = new NotificationService(this.templateRepository);

		if (this.user.emailVerified) return;

		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 1);
		const code = randomInt(1000);

		await this.userVerificationCodeRepository.create(
			UserVerificationCode.create({
				expiresAt,
				usedAt: null,
				userId: this.user.id,
				value: code,
			}),
		);

		const message = await notificationService.getMessage('validate-email', {
			userName: this.user.name.value,
			code: String(code),
		});

		await this.notificationsProvider.send({
			to: this.user.email.value,
			subject: message.subject,
			body: message.body,
		});
	}
}
