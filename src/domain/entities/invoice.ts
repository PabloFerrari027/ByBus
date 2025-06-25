import { PaymentMethod, PaymentProvider } from '@/application/strategies/payment-strategy.js';
import { InvoiceNumber } from '../value-objects/invoice-number.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	ticketId: UUID;
	userId: UUID;
	transactionId: string;
	totalInCents: number;
	discountInCents: number;
	issuedAt: Date;
	paymentMethod: PaymentMethod;
	paymentProvider: PaymentProvider;
	invoiceNumber: InvoiceNumber;
	downloadURL: string;
}

export interface InvoiceJSON {
	id: UUIDJSON;
	ticket_id: UUIDJSON;
	user_id: UUIDJSON;
	transaction_id: UUIDJSON;
	total_in_cents: number;
	discount_in_cents: number;
	issued_at: string;
	payment_method: PaymentMethod;
	payment_Provider: PaymentProvider;
	invoice_number: string;
	download_url: string;
}

export class Invoice {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get ticketId(): UUID {
		return this.props.ticketId;
	}

	get userId(): UUID {
		return this.props.userId;
	}

	get transactionId(): string {
		return this.props.transactionId;
	}

	get totalInCents(): number {
		return this.props.totalInCents;
	}

	get discountInCents(): number {
		return this.props.discountInCents;
	}

	get issuedAt(): Date {
		return this.props.issuedAt;
	}

	get paymentMethod(): PaymentMethod {
		return this.props.paymentMethod;
	}

	get paymentProvider(): PaymentProvider {
		return this.props.paymentProvider;
	}

	get invoiceNumber(): InvoiceNumber {
		return this.props.invoiceNumber;
	}

	get downloadURL(): string {
		return this.props.downloadURL;
	}

	toJSON(): InvoiceJSON {
		return {
			id: this.id.value,
			ticket_id: this.ticketId.value,
			user_id: this.userId.value,
			transaction_id: this.transactionId,
			total_in_cents: this.totalInCents,
			discount_in_cents: this.discountInCents,
			issued_at: this.issuedAt.toISOString(),
			payment_method: this.paymentMethod,
			payment_Provider: this.paymentProvider,
			invoice_number: this.invoiceNumber.value,
			download_url: this.downloadURL,
		};
	}

	static create(props: Props): Invoice {
		return new Invoice(props);
	}
}
