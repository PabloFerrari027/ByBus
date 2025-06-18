import { BusStopAddedToRouteEvent } from '@/domain/events/bus-stop-added-to-route-event.js';
import { Handler } from '@/shared/core/queues/handler.js';
import { Queue, QueuesProvider } from '../ports/providers/queues-provider.js';

export class BusStopAddedHandler extends Handler {
	private queue: Queue | null;

	constructor(private readonly queuesProvider: QueuesProvider) {
		super();
		this.queue = null;
	}

	async execute(event: BusStopAddedToRouteEvent) {
		this.queue = await this.queuesProvider.get('bus-stops');
		if (!this.queue) this.queue = await this.queuesProvider.create('bus-stops');
		await this.queue.publish('create-bus-stop', () => {});
	}
}
