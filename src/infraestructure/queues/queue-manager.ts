import { SendWelcome } from '@/application/event-handlers/send-welcome.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';

export class QueueManager {
	constructor(
		private readonly queuesProvider: QueuesProvider,
		private readonly notificationsProvider: NotificationsProvider,
		private readonly usersRepository: UsersRepository,
	) {}

	public async registerAll() {
		await this.queuesProvider.connect();
		const usersQueue = await this.queuesProvider.create('users');
		const sendWelcome = new SendWelcome(this.notificationsProvider, this.usersRepository);
		usersQueue.subscribe(CreatedUserEvent.name, sendWelcome);
	}
}
