import { NotAcceptable } from '../errors/not-acceptable.js';
import { Text } from './text.js';

export type NameJSON = string;

export class Name {
	readonly value: string;

	private constructor(value: string) {
		this.value = Text.create(value, 'PASCALCASE').value;
	}

	equals(name: string | Name): boolean {
		if (typeof name === 'string') return name === this.value;
		return this.value === name.value;
	}

	toJSON(): NameJSON {
		return this.value;
	}

	static compare(name1: Name, name2: Name): boolean {
		return name1.value === name2.value;
	}

	static validate(name: string): void {
		const isEmpty = name.trim().length === 0;

		if (isEmpty) {
			throw new NotAcceptable('Invalid name', 'Name is empty');
		}

		const invalidChars = /[^a-zA-ZÀ-ÿ\s'-]/;
		if (invalidChars.test(name)) {
			throw new NotAcceptable('Invalid Name', 'Name contains invalid characters');
		}
	}

	static create(value: string): Name {
		this.validate(value);
		return new Name(value);
	}
}
