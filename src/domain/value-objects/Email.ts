import { NotAcceptable } from '../errors/not-accptable.js';

export class Email {
	readonly value: string;

	constructor(value: string) {
		this.value = value;
	}

	static compare(email1: Email, email2: Email): boolean {
		return email1.value === email2.value;
	}

	static validate(email: string) {
		const isEmpy = email.trim().length === 0;
		if (isEmpy) {
			const title = 'Invalid email';
			const message = 'Email is empy';
			throw new NotAcceptable(title, message);
		}
	}

	static create(value: string): Email {
		return new Email(value);
	}
}
