import { Event } from '@/domain/events/event.js';
import { Handler } from '@/shared/core/queues/handler.js';

export class DomainEvents {
	private static handlers = new Map<string, Handler[]>();

	static register<T>(eventName: string, handler: Handler) {
		const existing = this.handlers.get(eventName) ?? [];
		existing.push(handler);
		this.handlers.set(eventName, existing);
	}

	static async dispatch(events: Event[]) {
		for (const event of events) {
			const handlers = this.handlers.get(event.constructor.name) ?? [];
			await Promise.all(handlers.map(async handler => await handler.execute(event)));
		}
	}

	static clearHandlers(): void {
		DomainEvents.handlers.clear();
	}
}
