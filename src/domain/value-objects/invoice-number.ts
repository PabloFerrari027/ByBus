import { NotAcceptable } from '../errors/not-acceptable.js';

export class InvoiceNumber {
	private readonly _value: string;

	private constructor(value: string) {
		this._value = value;
	}

	get value(): string {
		return this._value;
	}

	static create(value: string): InvoiceNumber {
		if (!/^NF-\d{6,}$/.test(value)) {
			const title = 'Invalid Invoice';
			const message = 'Invalid invoice number format';
			throw new NotAcceptable(title, message);
		}
		return new InvoiceNumber(value);
	}
}
