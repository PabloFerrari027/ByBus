import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';
import { BusStopRepository } from '@/application/ports/repositories/bus-stop-repository.js';
import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { UserVerificationCodeRepository } from '@/application/ports/repositories/user-verification-code-repository.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { CreateBusStopHandler } from '@/application/queues-handlers/create-bus-stop-handler.js';
import { SendWelcomeHandler } from '@/application/queues-handlers/send-welcome-handler.js';
import { NotifyPasswordChangedHandler } from '@/application/queues-handlers/notify-password-changed-handler.js';
import { SendVerificationCodeHanlder } from '@/application/queues-handlers/send-verification-code-handler.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';

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
		private readonly busStopRepository: BusStopRepository,
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
			this.ENVProvider,
			this.userVerificationCodeRepository,
			this.loggerProvider,
		);
		const notifyPasswordChangedHandler = new NotifyPasswordChangedHandler(
			this.notificationsProvider,
			this.usersRepository,
			this.templateRepository,
			this.loggerProvider,
		);

		const createBusStopHandler = new CreateBusStopHandler(
			this.busStopRepository,
			this.loggerProvider,
		);

		const accountsQueue = await this.queuesProvider.create('accounts');
		const busRoutesQueue = await this.queuesProvider.create('bus-routes');

		accountsQueue.subscribe('send-welcome', sendWelcomeHandler);
		accountsQueue.subscribe('send-verification-code', sendVerificationCodeHanlder);
		accountsQueue.subscribe('notify-password-changed', notifyPasswordChangedHandler);
		busRoutesQueue.subscribe('create-bus-stop', createBusStopHandler);
	}
}
