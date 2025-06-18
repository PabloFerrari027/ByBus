import { NotAcceptable } from '../errors/not-acceptable.js';

export type EmailJSON = string;

export class Email {
	readonly value: string;

	private constructor(value: string) {
		this.value = value;
	}

	equals(email: string | Email): boolean {
		if (typeof email === 'string') return email === this.value;
		return this.value === email.value;
	}

	toJSON(): EmailJSON {
		return this.value;
	}

	static compare(email1: Email, email2: Email): boolean {
		return email1.value === email2.value;
	}

	static validate(email: string): void {
		const isEmpty = email.trim().length === 0;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (isEmpty) {
			throw new NotAcceptable('Invalid email', 'Email is empty');
		}

		if (!emailRegex.test(email)) {
			throw new NotAcceptable('Invalid email', 'Email format is invalid');
		}
	}

	static create(value: string): Email {
		this.validate(value);
		return new Email(value);
	}
}
