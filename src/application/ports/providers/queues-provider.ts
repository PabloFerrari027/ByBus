import { Handler } from '../../../shared/core/queues/handler.js';

export abstract class QueueItem {
	abstract listen(data: any): Promise<void>;
}

export abstract class Queue {
	abstract get key(): string;
	abstract subscribe(handler: Handler): void;
	abstract publish(data: any): Promise<void>;
}

export abstract class QueuesProvider {
	abstract create(key: string): Promise<Queue>;
	abstract get(key: string): Promise<Queue | null>;
}
