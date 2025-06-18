import { Text } from './text.js';
import { NotAcceptable } from '../errors/not-acceptable.js';

export type LicensePlateJSON = string;

export class LicensePlate {
	readonly value: string;

	private constructor(value: string) {
		this.value = Text.create(value, 'UPPERCASE').value;
	}

	equals(licensePlate: string | LicensePlate): boolean {
		if (typeof licensePlate === 'string') return licensePlate === this.value;
		return this.value === licensePlate.value;
	}

	toJSON(): LicensePlateJSON {
		return this.value;
	}

	static compare(plate1: LicensePlate, plate2: LicensePlate): boolean {
		return plate1.value === plate2.value;
	}

	static isValid(value: string): boolean {
		const trimmed = value.trim();
		const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
		return regex.test(trimmed);
	}

	static create(value: string): LicensePlate {
		if (!this.isValid(value)) {
			const title = 'Invalid license plate';
			const message = 'License plate format is invalid';
			throw new NotAcceptable(title, message);
		}
		return new LicensePlate(value);
	}
}
