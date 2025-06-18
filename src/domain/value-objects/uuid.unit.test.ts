import { describe, it } from 'node:test';
import assert from 'assert';
import { UUID } from './uuid.js';

describe('UUID', () => {
	it('should create a UUID with a given value', () => {
		const uuid = UUID.create('7c3a1b9e-6fa9-4f9f-9a8a-8d2ec8f4e7c5');
		assert.strictEqual(uuid.value, '7c3a1b9e-6fa9-4f9f-9a8a-8d2ec8f4e7c5');
	});

	it('should be possible to trigger an error if the provided value does not meet the requirements', () => {
		assert.throws(() => UUID.create('123'));
	});

	it('should create a UUID with a default random value', () => {
		const uuid = UUID.create();
		assert.strictEqual(typeof uuid.value, 'string');
		assert.match(
			uuid.value,
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
	});

	it('should compare UUID values correctly', () => {
		const uuid1 = UUID.create('7c3a1b9e-6fa9-4f9f-9a8a-8d2ec8f4e7c5');
		const uuid2 = UUID.create('7c3a1b9e-6fa9-4f9f-9a8a-8d2ec8f4e7c5');
		const uuid3 = UUID.create('f2b1c7d4-3a96-4d0d-9849-6e0e0f5c9b32');

		assert.ok(uuid1.equals('7c3a1b9e-6fa9-4f9f-9a8a-8d2ec8f4e7c5'));
		assert.ok(uuid1.equals(uuid2));
		assert.ok(!uuid1.equals(uuid3));

		assert.ok(UUID.compare(uuid1, uuid2));
		assert.ok(!UUID.compare(uuid1, uuid3));
	});

	it('should generate a valid UUID string', () => {
		const uuidStr = UUID.generate();
		assert.strictEqual(typeof uuidStr, 'string');
		assert.match(uuidStr, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
	});

	it('should return UUID as JSON', () => {
		const uuid = UUID.create('7c3a1b9e-6fa9-4f9f-9a8a-8d2ec8f4e7c5');
		assert.strictEqual(uuid.toJSON(), '7c3a1b9e-6fa9-4f9f-9a8a-8d2ec8f4e7c5');
	});
});
