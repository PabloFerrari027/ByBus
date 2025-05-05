import { InMemoryNotificationStrategy } from './../../application/strategies/in-memory-notification-strategy.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { InMemoryNotificationsProvider } from '../providers/in-memory/in-memory-notifications-provider.js';

type Implementation = 'IN-MEMORY';

let provider: NotificationsProvider;

export function MakeNotificationsProvider(implementation: Implementation) {
	switch (implementation) {
		case 'IN-MEMORY':
			if (provider instanceof InMemoryNotificationStrategy) return provider;
			const inMemoryNotificationStrategy = new InMemoryNotificationStrategy();
			provider = new InMemoryNotificationsProvider(inMemoryNotificationStrategy);
			break;
		default:
			break;
	}

	return provider;
}
