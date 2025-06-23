import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';
import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { UserVerificationCodeRepository } from '@/application/ports/repositories/user-verification-code-repository.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { SendWelcomeHandler } from './handlers/send-welcome-handler.js';
import { SendVerificationCodeHanlder } from './handlers/send-verification-code-handler.js';
import { NotifyPasswordChangedHandler } from './handlers/notify-password-changed-handler.js';

export class QueueManager {
	constructor(
		private readonly queuesProvider: QueuesProvider,
		private readonly notificationsProvider: NotificationsProvider,
		private readonly usersRepository: UsersRepository,
		private readonly templateRepository: TemplateRepository,
		private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
		private readonly loggerProvider: LoggerProvider,
	) {}

	public async registerAll() {
		const sendWelcomeHandler = new SendWelcomeHandler(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.loggerProvider,
		);
		const sendVerificationCodeHanlder = new SendVerificationCodeHanlder(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.userVerificationCodeRepository,
			this.loggerProvider,
		);
		const notifyPasswordChangedHandler = new NotifyPasswordChangedHandler(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.loggerProvider,
		);

		const [sendWelcomeQueue, sendVerificationCodeQueue, notifyPasswordChangedQueue] =
			await Promise.all([
				this.queuesProvider.create('send-welcome'),
				this.queuesProvider.create('send-verification-code'),
				this.queuesProvider.create('notify-password-changed'),
			]);

		sendWelcomeQueue.subscribe(sendWelcomeHandler);
		sendVerificationCodeQueue.subscribe(sendVerificationCodeHanlder);
		notifyPasswordChangedQueue.subscribe(notifyPasswordChangedHandler);
	}
}
