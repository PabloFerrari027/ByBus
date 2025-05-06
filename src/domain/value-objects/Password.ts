import bcrypt from 'bcrypt';
import { NotAccptable } from '../errors/not-accptable.js';

export class Password {
	readonly value: string;

	constructor(value: string) {
		this.value = value;
	}

	static async compare(password1: Password, password2: Password): Promise<boolean> {
		return await bcrypt.compare(password1.value, password2.value);
	}

	static hash(password: string): string {
		return bcrypt.hashSync(password, 10);
	}

	static validate(password: string) {
		const isEmpy = password.trim().length === 0;
		if (isEmpy) {
			const title = 'Invalid password';
			const message = 'Password is empy';
			throw new NotAccptable(title, message);
		}
	}

	static create(value: string): Password {
		return new Password(value);
	}
}
