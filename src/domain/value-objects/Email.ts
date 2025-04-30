export class Email {
	readonly value: string;

	constructor(value: string) {
		this.value = value;
	}

	static compare(email1: Email, email2: Email): boolean {
		return email1.value === email2.value;
	}

	static create(value: string): Email {
		return new Email(value);
	}
}
