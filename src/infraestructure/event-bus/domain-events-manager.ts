import { DomainEvents } from './domain-events.js';
import { CreatedSessionHandler } from '@/application/event-handlers/created-session-handler.js';
import { PasswordChangedHandler } from '@/application/event-handlers/password-changed-handler.js';
import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { CreatedSessionEvent } from '@/domain/events/created-session-event.js';
import { PasswordChangeEvent } from '@/domain/events/password-change-event.js';

export class DomainEventsManager {
	constructor(queuesProvider: QueuesProvider, usersRepository: UsersRepository) {
		const createdSessionHandler = new CreatedSessionHandler(queuesProvider, usersRepository);
		const passwordChangedHandler = new PasswordChangedHandler(queuesProvider);

		DomainEvents.register(CreatedSessionEvent.name, createdSessionHandler);
		DomainEvents.register(PasswordChangeEvent.name, passwordChangedHandler);
	}
}
