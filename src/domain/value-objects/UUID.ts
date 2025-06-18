import { NotAcceptable } from '../errors/not-acceptable.js';

export type UUIDJSON = string;

export class UUID {
	readonly value: string;

	private constructor(value: string) {
		if (!UUID.isValidUUID(value)) {
			const title = 'Invalid UUID format';
			const message = `Value: ${value}`;
			throw new NotAcceptable(title, message);
		}
		this.value = value;
	}

	equals(uuid: string | UUID): boolean {
		if (typeof uuid === 'string') return uuid === this.value;
		return this.value === uuid.value;
	}

	toJSON(): UUIDJSON {
		return this.value;
	}

	static generate(): string {
		return crypto.randomUUID();
	}

	static compare(uuid1: UUID, uuid2: UUID): boolean {
		return uuid1.value === uuid2.value;
	}

	static create(value?: string): UUID {
		return new UUID(value ?? UUID.generate());
	}

	static isValidUUID(value: string): boolean {
		const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return uuidV4Regex.test(value);
	}
}
