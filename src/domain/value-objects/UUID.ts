export class UUID {
	readonly value: string;

	constructor(value: string) {
		this.value = value;
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
}
