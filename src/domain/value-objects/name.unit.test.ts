import { describe, it } from 'node:test';
import assert from 'assert';
import { Name } from './name.js';
import { NotAcceptable } from '../errors/not-acceptable.js';

describe('Name', () => {
	it('should be able to create a name', () => {
		const name = Name.create('John Doe');
		assert.ok(name instanceof Name);
		assert.strictEqual(name.value, 'John Doe');
	});

	it('should be able to compare names', () => {
		const name1 = Name.create('John Doe');
		const name2 = Name.create('John Doe');
		const name3 = Name.create('Bob');

		assert.ok(name1.equals('John Doe'));
		assert.ok(name1.equals(name2));
		assert.ok(!name1.equals(name3));
		assert.ok(Name.compare(name1, name2));
		assert.ok(!Name.compare(name1, name3));
	});

	it('should validate correct and incorrect names', () => {
		const name = Name.create('John Doe');
		assert.doesNotThrow(() => Name.validate(name.value));

		assert.throws(() => Name.validate(''), NotAcceptable);
		assert.throws(() => Name.validate('   '), NotAcceptable);
		assert.throws(() => Name.validate('!@#'), NotAcceptable);
	});

	it('should return the name as JSON', () => {
		const name = Name.create('John Doe');
		assert.deepStrictEqual(name.toJSON(), 'John Doe');
	});
});
