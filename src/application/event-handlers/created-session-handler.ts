import { Handler } from '../../shared/core/queues/handler.js';
import { CreatedSessionEvent } from '@/domain/events/created-session-event.js';
import { Queue, QueuesProvider } from '../ports/providers/queues-provider.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { NotFound } from '@/domain/errors/not-found.js';

export class CreatedSessionHandler extends Handler {
	private queue: Queue | null;

	constructor(
		private readonly queuesProvider: QueuesProvider,
		private readonly usersRepository: UsersRepository,
	) {
		super();
		this.queue = null;
	}

	async execute(event: CreatedSessionEvent) {
		this.queue = await this.queuesProvider.get('users');
		if (!this.queue) this.queue = await this.queuesProvider.create('users');

		const user = await this.usersRepository.findById(event.userId.value);

		if (!user) {
			const title = 'User Not Found';
			const message = 'The requested user was not found.';
			throw new NotFound(title, message);
		}

		if (user.isEmailVerified) {
			await this.queue.publish('send-welcome-notification', {
				userId: event.userId,
				sessionId: event.sessionId,
			});
		} else {
			await this.queue.publish('send-verification-code', {
				userId: event.userId,
				sessionId: event.sessionId,
			});
		}
	}
}
