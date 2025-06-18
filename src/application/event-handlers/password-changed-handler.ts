import { Handler } from '../../shared/core/queues/handler.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { Queue, QueuesProvider } from '../ports/providers/queues-provider.js';

export class PasswordChangedHandler extends Handler {
	private queue: Queue | null;

	constructor(private readonly queuesProvider: QueuesProvider) {
		super();
		this.queue = null;
	}

	async execute(event: CreatedUserEvent) {
		this.queue = await this.queuesProvider.get('accounts');
		if (!this.queue) this.queue = await this.queuesProvider.create('accounts');
		await this.queue.publish('notify-password-changed', () => {});
	}
}
