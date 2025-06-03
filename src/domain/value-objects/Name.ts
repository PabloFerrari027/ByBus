import { NotAcceptable } from '../errors/not-accptable.js';
import { Text } from './text.js';

export class Name {
	readonly value: string;

	constructor(value: string) {
		this.value = Text.create(value, 'PASCALCASE').value;
	}

	compare(name: string | Name): boolean {
		if (typeof name === 'string') return name === this.value;
		return this.value === name.value;
	}

	static compare(name1: Name, name2: Name): boolean {
		return name1.value === name2.value;
	}

	static validate(name: string) {
		const isEmpy = name.trim().length === 0;
		if (isEmpy) {
			const title = 'Invalid name';
			const message = 'Name is empy';
			throw new NotAcceptable(title, message);
		}
	}

	static create(value: string): Name {
		return new Name(value);
	}
}
