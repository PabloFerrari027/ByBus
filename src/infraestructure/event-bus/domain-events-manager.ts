import { DomainEvents } from './domain-events.js';
import { CreatedSessionHandler } from '@/application/event-handlers/created-session-handler.js';
import { UserCreatedHandler } from '@/application/event-handlers/user-created-handler.js';
import { PasswordChangedHandler } from '@/application/event-handlers/password-changed-handler.js';
import { BusStopAddedHandler } from '@/application/event-handlers/bus-stop-added-handler.js';
import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';

export class DomainEventsManager {
	constructor(queuesProvider: QueuesProvider) {
		const createdSessionHandler = new CreatedSessionHandler(queuesProvider);
		const userCreatedHandler = new UserCreatedHandler(queuesProvider);
		const passwordChangedHandler = new PasswordChangedHandler(queuesProvider);
		const busStopAddedHandler = new BusStopAddedHandler(queuesProvider);

		DomainEvents.register('created-session', createdSessionHandler);
		DomainEvents.register('user-created', userCreatedHandler);
		DomainEvents.register('password-changed', passwordChangedHandler);
		DomainEvents.register('bus-stop-added', busStopAddedHandler);
	}
}
