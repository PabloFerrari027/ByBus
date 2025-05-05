import { Handler } from '@/shared/core/queues/handler.js';
import {
	Queue as IQeue,
	QueueItem as IQueueItem,
	QueuesProvider as IQueuesProvider,
} from '@/application/ports/providers/queues-provider.js';

export class QueueItem extends IQueueItem {
	private readonly _key: string;
	private readonly handler: Handler;

	constructor(key: string, handler: Handler) {
		super();
		this._key = key;
		this.handler = handler;
	}

	get key(): string {
		return this._key;
	}

	async listen(data: any): Promise<void> {
		await this.handler.execute(data);
	}
}

export class Queue extends IQeue {
	private readonly _key: string;
	private readonly items: Array<QueueItem> = [];

	constructor(key: string) {
		super();
		this._key = key;
	}

	get key(): string {
		return this._key;
	}

	subscribe(key: string, handler: Handler): void {
		const queueItem = new QueueItem(key, handler);
		this.items.push(queueItem);
	}

	async publish(data: any): Promise<void> {
		await Promise.all(
			this.items.map(async (item, index) => {
				await item.listen(data);
				this.items.splice(index, 1);
			}),
		);
	}
}

export class InMemoryQueuesProvider extends IQueuesProvider {
	private queues: Array<Queue>;

	constructor() {
		super();
		this.queues = [];
	}

	async connect(): Promise<void> {
		return;
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
