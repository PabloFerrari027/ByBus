import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { ConsoleNotificationsProvider } from '../providers/console-notifications-provider.js';
import { EmailNotificationStrategy } from '@/application/strategies/email-notification-strategy.js';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { InMemoryNotificationStrategy } from '@/application/strategies/in-memory-notification-strategy.js';

type Implementation = 'CONSOLE' | 'EMAIL';

let provider: NotificationsProvider;

export function MakeNotificationsProvider(
	implementation: Implementation,
	ENVProvider: ENVProvider,
	loggerProvider: LoggerProvider,
) {
	switch (implementation) {
		case 'CONSOLE':
			if (provider instanceof InMemoryNotificationStrategy) return provider;
			const inMemoryNotificationStrategy = new InMemoryNotificationStrategy();
			provider = new ConsoleNotificationsProvider(inMemoryNotificationStrategy);
			break;
		case 'EMAIL':
			if (provider instanceof EmailNotificationStrategy) return provider;
			const emailNotificationStrategy = new EmailNotificationStrategy(ENVProvider, loggerProvider);
			provider = new ConsoleNotificationsProvider(emailNotificationStrategy);
			break;
		default:
			break;
	}

	return provider;
}
