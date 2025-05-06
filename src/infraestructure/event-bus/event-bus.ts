import { Queue } from '@/application/ports/providers/queues-provider.js';
import { Event } from '@/domain/events/event.js';

export class EventBus {
	private static channels: Map<string, Queue[]> = new Map();

	static subscribe(key: string, channel: Queue) {
		if (!this.channels.has(key)) this.channels.set(key, []);
		this.channels.get(key)?.push(channel);
	}

	static async publish(event: Event<unknown>) {
		const channels = this.channels.get(event.key) || [];

		for await (const channel of channels) {
			await channel.publish(event.key, event);
		}
	}
}
