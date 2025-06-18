import { describe, it } from 'node:test';
import { UUID } from '../value-objects/uuid.js';
import assert from 'assert';
import { Driver } from './driver.js';
import { Name } from '../value-objects/name.js';

describe('Driver', () => {
	it('should be able to create a driver', () => {
		const id = UUID.create();
		const name = Name.create('Pablo');
		const tripCount = 1;
		const driver = Driver.create({ id, name, tripCount });
		assert.ok(driver instanceof Driver);
		assert.ok(id.equals(driver.id));
		assert.ok(name.equals(driver.name));
		assert.ok(id.equals(driver.id));
	});

	it("should be possible to increase a driver's trips", () => {
		const id = UUID.create();
		const name = Name.create('Pablo');
		const tripCount = 0;
		const driver = Driver.create({ id, name, tripCount });
		driver.incrementTripCount();
		assert.equal(driver.tripCount, 1);
	});

	it('should return the driver as JSON', async () => {
		const id = UUID.create();
		const name = Name.create('Pablo');
		const tripCount = 1;
		const driver = Driver.create({ id, name, tripCount });

		assert.deepStrictEqual(driver.toJSON(), {
			id: id.toJSON(),
			name: name.toJSON(),
			trip_count: 1,
		});
	});
});
