import bcrypt from 'bcrypt';

export class Password {
	readonly value: string;

	constructor(value: string) {
		this.value = value;
	}

	static async compare(
		password1: Password,
		password2: Password,
	): Promise<boolean> {
		return await bcrypt.compare(password1.value, password2.value);
	}

	static hash(password: string): string {
		return bcrypt.hashSync(password, 10);
	}

	static create(value: string): Password {
		return new Password(value);
	}
}
