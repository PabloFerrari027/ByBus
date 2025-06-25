import { NotAcceptable } from '../errors/not-acceptable.js';

export type BusCodeJSON = string;

export class BusCode {
	readonly value: string;

	private constructor(value: string) {
		this.value = value;
	}

	equals(code: string | BusCode): boolean {
		if (typeof code === 'string') return code === this.value;
		return this.value === code.value;
	}

	toJSON(): BusCodeJSON {
		return this.value;
	}

	static compare(code1: BusCode, code2: BusCode): boolean {
		return code1.value === code2.value;
	}

	static validate(code: string): void {
		const isEmpty = code.trim().length === 0;

		if (isEmpty) {
			throw new NotAcceptable('Invalid code', 'Code is empty');
		}
	}

	static create(value: string): BusCode {
		this.validate(value);
		return new BusCode(value);
	}
}
