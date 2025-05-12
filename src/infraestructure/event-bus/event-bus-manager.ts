import { EventBus } from './event-bus.js';
import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';
import { PasswordChangeEvent } from '@/domain/events/password-change-event.js';
import { NameChangeEvent } from '@/domain/events/name-change-event.js';
import { VerifiedUserEvent } from '@/domain/events/verified-user-event.js';
import { LoginEvent } from '@/domain/events/login-event.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';

export class EventBusManager {
	constructor(private readonly queuesProvider: QueuesProvider) {}

	public async registerAll() {
		const usersQueue = await this.queuesProvider.get('users');
		if (!usersQueue) throw new Error('User queues not found');
		EventBus.subscribe(CreatedUserEvent.key, usersQueue);
		EventBus.subscribe(PasswordChangeEvent.key, usersQueue);
		EventBus.subscribe(NameChangeEvent.key, usersQueue);
		EventBus.subscribe(VerifiedUserEvent.key, usersQueue);
		EventBus.subscribe(LoginEvent.key, usersQueue);
	}
}
