import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { ConsoleNotificationsProvider } from '../providers/console-notifications-provider.js';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { EmailNotificationsProvider } from '../providers/email-notifications-provider.js';

type Implementation = 'CONSOLE' | 'EMAIL';

let provider: NotificationsProvider;

export function MakeNotificationsProvider(
	implementation: Implementation,
	ENVProvider: ENVProvider,
	loggerProvider: LoggerProvider,
) {
	switch (implementation) {
		case 'CONSOLE':
			if (provider instanceof ConsoleNotificationsProvider) return provider;
			provider = new ConsoleNotificationsProvider();
			break;
		case 'EMAIL':
			if (provider instanceof EmailNotificationsProvider) return provider;
			provider = new EmailNotificationsProvider(ENVProvider, loggerProvider);
			break;
		default:
			break;
	}

	return provider;
}
