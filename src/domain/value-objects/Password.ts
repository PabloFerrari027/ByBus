import bcrypt from 'bcrypt';
import { NotAcceptable } from '../errors/not-acceptable.js';

export type PasswordJSON = string;

export class Password {
	readonly value: string;

	private constructor(value: string) {
		this.value = value;
	}

	static validate(value: string) {
		if (!value || value.length < 6) {
			const title = 'Short Password';
			const message = 'Password must be at least 6 characters long.';
			throw new NotAcceptable(title, message);
		}
	}

	static async create(password: string): Promise<Password> {
		this.validate(password);
		const hashed = await bcrypt.hash(password, 10);
		return new Password(hashed);
	}

	async equals(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.value);
	}

	toJSON(): PasswordJSON {
		return this.value;
	}

	static async compare(p1: Password | string, p2: Password | string): Promise<boolean> {
		if (typeof p1 === 'string' && typeof p2 === 'string') {
			return p1 === p2;
		}

		if (typeof p1 === 'string' && p2 instanceof Password) {
			return await bcrypt.compare(p1, p2.value);
		}

		if (p1 instanceof Password && typeof p2 === 'string') {
			return await bcrypt.compare(p2, p1.value);
		}

		p1 = p1 as Password;
		p2 = p2 as Password;
		return p1.value === p2.value;
	}
}
