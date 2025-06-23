import { User } from '@/domain/entities/user.js';
import { UserVerificationCode } from '@/domain/entities/user-verification-code.js';
import { randomInt } from 'crypto';
import { UUID } from '@/domain/value-objects/uuid.js';
import { Handler } from '@/shared/core/queues/handler.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { UserVerificationCodeRepository } from '@/application/ports/repositories/user-verification-code-repository.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationService } from '@/application/services/notification-service.js';

interface Input {
	userId: UUID;
}

export class SendVerificationCodeHanlder extends Handler {
	private user: User | null;

	constructor(
		private readonly notificationsProvider: NotificationsProvider,
		private readonly usersRepository: UsersRepository,
		private readonly templateRepository: TemplateRepository,
		private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
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

		if (this.user.isEmailVerified) return;

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
