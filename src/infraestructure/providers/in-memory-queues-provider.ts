import { Handler } from '@/shared/core/queues/handler.js';
import {
	Queue as IQueue,
	QueueItem as IQueueItem,
	QueuesProvider as IQueuesProvider,
} from '@/application/ports/providers/queues-provider.js';

export class QueueItem extends IQueueItem {
	private readonly handler: Handler;

	constructor(handler: Handler) {
		super();
		this.handler = handler;
	}

	async listen(data: any): Promise<void> {
		await this.handler.execute(data);
	}
}

export class Queue extends IQueue {
	private readonly _key: string;
	private readonly items: Array<QueueItem> = [];

	constructor(key: string) {
		super();
		this._key = key;
	}

	get key(): string {
		return this._key;
	}

	subscribe(handler: Handler): void {
		const queueItem = new QueueItem(handler);
		this.items.push(queueItem);
	}

	async publish(data: any): Promise<void> {
		Promise.all(this.items.map(async item => await item.listen(data)));
	}
}

export class InMemoryQueuesProvider extends IQueuesProvider {
	private queues: Array<Queue>;

	constructor() {
		super();
		this.queues = [];
	}

	async create(key: string): Promise<Queue> {
		const queue = new Queue(key);
		this.queues.push(queue);
		return queue;
	}

	async get(key: string): Promise<Queue | null> {
		return this.queues.find(queue => queue.key === key) || null;
	}
}
