import { Handler } from '../../shared/core/queues/handler.js';
import { Queue, QueuesProvider } from '../ports/providers/queues-provider.js';
import { TicketPaymentEvent } from '@/domain/events/ticket-payment-event.js';

export class TicketPaymentHandler extends Handler {
	private queue: Queue | null;

	constructor(private readonly queuesProvider: QueuesProvider) {
		super();
		this.queue = null;
	}

	async execute(event: TicketPaymentEvent) {
		this.queue = await this.queuesProvider.get('generate-invoice');
		if (!this.queue) this.queue = await this.queuesProvider.create('generate-invoice');
		await this.queue.publish({
			userId: event.userId,
			ticketId: event.ticketId,
			paymentMethod: event.paymentMethod,
			paymentProvider: event.paymentProvider,
			transactionId: event.transactionId,
		});
	}
}
