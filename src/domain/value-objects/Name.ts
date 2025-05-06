import { NotAccptable } from '../errors/not-accptable.js';
import { Text } from './Text.js';

export class Name {
	readonly value: string;

	constructor(value: string) {
		this.value = Text.create(value, 'PASCALCASE').value;
	}

	static compare(name1: Name, name2: Name): boolean {
		return name1.value === name2.value;
	}

	static validate(name: string) {
		const isEmpy = name.trim().length === 0;
		if (isEmpy) {
			const title = 'Invalid name';
			const message = 'Name is empy';
			throw new NotAccptable(title, message);
		}
	}

	static create(value: string): Name {
		return new Name(value);
	}
}
