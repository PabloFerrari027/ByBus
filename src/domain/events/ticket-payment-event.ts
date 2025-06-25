import { PaymentMethod, PaymentProvider } from '@/application/strategies/payment-strategy.js';
import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

export class TicketPaymentEvent extends Event {
	public occurredOn: Date;

	constructor(
		public readonly userId: UUID,
		public readonly ticketId: UUID,
		public readonly paymentMethod: PaymentMethod,
		public readonly paymentProvider: PaymentProvider,
		public readonly transactionId: string,
	) {
		super();
		this.occurredOn = new Date();
	}
}
