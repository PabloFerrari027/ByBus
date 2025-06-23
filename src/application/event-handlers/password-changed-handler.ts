import { PasswordChangeEvent } from '@/domain/events/password-change-event.js';
import { Handler } from '../../shared/core/queues/handler.js';
import { Queue, QueuesProvider } from '../ports/providers/queues-provider.js';

export class PasswordChangedHandler extends Handler {
	private queue: Queue | null;

	constructor(private readonly queuesProvider: QueuesProvider) {
		super();
		this.queue = null;
	}

	async execute(event: PasswordChangeEvent) {
		this.queue = await this.queuesProvider.get('notify-password-changed');
		if (!this.queue) this.queue = await this.queuesProvider.create('notify-password-changed');
		await this.queue.publish(() => {});
	}
}
