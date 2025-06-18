import { describe, it } from 'node:test';
import assert from 'assert';
import { Email } from './email.js';
import { NotAcceptable } from '../errors/not-acceptable.js';

describe('Email', () => {
	it('should be able to create an email', () => {
		const email = Email.create('user@example.com');
		assert.ok(email instanceof Email);
		assert.strictEqual(email.value, 'user@example.com');
	});

	it('should be able to compare emails', () => {
		const email = Email.create('user@example.com');
		assert.ok(email.equals('user@example.com'));
		assert.ok(email.equals(email));
		assert.ok(Email.compare(email, email));
	});

	it('should validate correct and incorrect emails', () => {
		const validEmail = Email.create('user@example.com');
		assert.doesNotThrow(() => Email.validate(validEmail.value));

		assert.throws(() => Email.validate(''), NotAcceptable);
		assert.throws(() => Email.validate('invalid-email'), NotAcceptable);
	});

	it('should return the email as JSON', () => {
		const email = Email.create('user@example.com');
		assert.deepStrictEqual(email.toJSON(), 'user@example.com');
	});
});
