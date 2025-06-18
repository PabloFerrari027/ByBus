import { describe, it } from 'node:test';
import assert from 'assert';
import { Password } from './password.js';
import { NotAcceptable } from '../errors/not-acceptable.js';

describe('Password', () => {
	it('should be able to create a password', async () => {
		const password = await Password.create('Password');
		assert.ok(password instanceof Password);
	});

	it('should be possible to trigger an error if the password is shorter than 6 characters', async () => {
		assert.rejects(async () => await Password.create('12345'), NotAcceptable);
	});

	it('should be able to compare password', async () => {
		const password = await Password.create('Password');
		assert.ok(await password.equals('Password'));
		assert.ok(await Password.compare(password, 'Password'));
		assert.ok(await Password.compare('Password', password));
		assert.ok(await Password.compare('Password', 'Password'));
		assert.ok(await Password.compare(password, password));
	});

	it('should be possible to get the entity data in a json format', async () => {
		const password = await Password.create('Password');
		const json = password.toJSON();
		assert.strictEqual(typeof json, 'string');
		assert.notStrictEqual(json, 'Password');
	});
});
