import { describe, it } from 'node:test';
import assert from 'assert';
import { LicensePlate } from './license-plate.js';

describe('License Plate', () => {
	it('should be able to create a license plate', () => {
		const licensePlate = LicensePlate.create('ABC1234');
		assert.ok(licensePlate instanceof LicensePlate);
		assert.strictEqual(licensePlate.value, 'ABC1234');
	});

	it('should be possible to trigger an error when reporting a plate with an invalid pattern', () => {
		assert.throws(() => LicensePlate.create('0000000'));
	});

	it('should be able to compare license plates', () => {
		const licensePlate = LicensePlate.create('ABC1234');
		assert.ok(licensePlate.equals('ABC1234'));
		assert.ok(licensePlate.equals(licensePlate));
		assert.ok(LicensePlate.compare(licensePlate, licensePlate));
	});

	it('should validate correct and incorrect license plates', () => {
		assert.strictEqual(LicensePlate.isValid('ABC1234'), true);
		assert.strictEqual(LicensePlate.isValid(''), false);
		assert.strictEqual(LicensePlate.isValid('123ABC'), false);
		assert.strictEqual(LicensePlate.isValid('A1B2C3D'), false);
	});

	it('should return the license plate as JSON', () => {
		const licensePlate = LicensePlate.create('ABC1234');
		assert.deepStrictEqual(licensePlate.toJSON(), 'ABC1234');
	});
});
