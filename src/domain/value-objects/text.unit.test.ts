import { describe, it } from 'node:test';
import assert from 'assert';
import { Text } from './text.js';

describe('Text', () => {
	it('should create CAPITALIZE text', () => {
		const text = Text.create('text test', 'CAPITALIZE');
		assert.ok(text instanceof Text);
		assert.strictEqual(text.value, 'Text test');
		assert.strictEqual(text.type, 'CAPITALIZE');
	});

	it('should create LOWERCASE text', () => {
		const text = Text.create('TEXT TEST', 'LOWERCASE');
		assert.strictEqual(text.value, 'text test');
		assert.strictEqual(text.type, 'LOWERCASE');
	});

	it('should create PASCALCASE text', () => {
		const text = Text.create('text test example', 'PASCALCASE');
		assert.strictEqual(text.value, 'Text Test Example');
		assert.strictEqual(text.type, 'PASCALCASE');
	});

	it('should create UPPERCASE text', () => {
		const text = Text.create('text test', 'UPPERCASE');
		assert.strictEqual(text.value, 'TEXT TEST');
		assert.strictEqual(text.type, 'UPPERCASE');
	});

	it('should compare text instances and values correctly', () => {
		const text = Text.create('text', 'UPPERCASE');

		// equals method
		assert.strictEqual(text.equals(text), true);
		assert.strictEqual(text.equals(''), false);

		// compare (strict mode)
		assert.strictEqual(Text.compare(text, text, true), true);
		assert.strictEqual(Text.compare(text, 'text', true), false); // because value is 'TEXT'

		// compare (non-strict mode)
		assert.strictEqual(Text.compare(text, text, false), true);
		assert.strictEqual(Text.compare(text, '', false), false);
		assert.strictEqual(Text.compare('', text, false), false);

		// compare using raw values
		assert.strictEqual(Text.compare(text.value, text.value, true), true);
		assert.strictEqual(Text.compare(text.value, '', true), false);
		assert.strictEqual(Text.compare(text.value, text.value, false), true);
		assert.strictEqual(Text.compare(text.value, '', false), false);
	});

	it('should detect if string is empty', () => {
		assert.ok(Text.isEmpty(''));
		assert.ok(!Text.isEmpty('Some Text'));
	});
});
