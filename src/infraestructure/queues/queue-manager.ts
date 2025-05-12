import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { NotifyLoginEvent } from '@/application/event-handlers/notify-login-event.js';
import { NotifyPasswordChangeEvent } from '@/application/event-handlers/notify-password-change-event.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';
import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { PasswordChangeEvent } from '@/domain/events/password-change-event.js';
import { NotifyVerifiedUserEvent } from '@/application/event-handlers/notify-verified-user-event.js';
import { VerifiedUserEvent } from '@/domain/events/verified-user-event.js';
import { LoginEvent } from '@/domain/events/login-event.js';
import { SendEmailVerificationCode } from '@/application/event-handlers/send-email-verification-code.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { UserVerificationCodeRepository } from '@/application/ports/repositories/user-verification-code-repository.js';

export class QueueManager {
	constructor(
		private readonly queuesProvider: QueuesProvider,
		private readonly notificationsProvider: NotificationsProvider,
		private readonly usersRepository: UsersRepository,
		private readonly templateRepository: TemplateRepository,
		private readonly ENVProvider: ENVProvider,
		private readonly tokenStrategy: TokenStrategy,
		private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
		private readonly loggerProvider: LoggerProvider,
	) {}

	public async registerAll() {
		const usersQueue = await this.queuesProvider.create('users');
		const notifyLoginEvent = new NotifyLoginEvent(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.loggerProvider,
		);
		const sendEmailVerificationCode = new SendEmailVerificationCode(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.ENVProvider,
			this.userVerificationCodeRepository,
			this.loggerProvider,
		);
		const notifyPasswordChangeEvent = new NotifyPasswordChangeEvent(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.loggerProvider,
		);
		const notifyVerifiedUserEvent = new NotifyVerifiedUserEvent(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.loggerProvider,
		);
		usersQueue.subscribe(LoginEvent.key, notifyLoginEvent);
		usersQueue.subscribe(CreatedUserEvent.key, sendEmailVerificationCode);
		usersQueue.subscribe(PasswordChangeEvent.key, notifyPasswordChangeEvent);
		usersQueue.subscribe(VerifiedUserEvent.key, notifyVerifiedUserEvent);
	}
}
