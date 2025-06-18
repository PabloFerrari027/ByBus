import { describe, it } from 'node:test';
import { Location } from '../value-objects/location.js';
import assert from 'assert';

describe('Location', () => {
	it('should be able to create a location', () => {
		const location = Location.create({ latitude: 0, longitude: 0 });

		assert.strictEqual(location.latitude, 0);
		assert.strictEqual(location.longitude, 0);

		const sameLocation = Location.create({ latitude: 0, longitude: 0 });
		assert.ok(location.isNear(sameLocation, 'latitude', 0));
	});

	it('should be able to compare locations', () => {
		const location1 = Location.create({ latitude: 10, longitude: 20 });
		const location2 = Location.create({ latitude: 10, longitude: 20 });
		const location3 = Location.create({ latitude: 11, longitude: 21 });

		assert.ok(location1.equals(location2));
		assert.ok(!location1.equals(location3));
	});

	it('should respect the "isNear" tolerance in latitude', () => {
		const base = Location.create({ latitude: 10, longitude: 10 });
		const near = Location.create({ latitude: 10.0005, longitude: 10 });
		const far = Location.create({ latitude: 10.01, longitude: 10 });

		assert.ok(base.isNear(near, 'latitude', 0.001));
		assert.ok(!base.isNear(far, 'latitude', 0.001));
	});

	it('should respect the "isNear" tolerance in longitude', () => {
		const base = Location.create({ latitude: 10, longitude: 10 });
		const near = Location.create({ latitude: 10, longitude: 10.0005 });
		const far = Location.create({ latitude: 10, longitude: 10.01 });

		assert.ok(base.isNear(near, 'longitude', 0.001));
		assert.ok(!base.isNear(far, 'longitude', 0.001));
	});

	it('should be possible to trigger an error if the latitude provided is greater than 90 or less than -90', () => {
		assert.throws(() => Location.create({ latitude: 91, longitude: 0 }));
		assert.throws(() => Location.create({ latitude: -91, longitude: 0 }));
	});

	it('should be possible to trigger an error if the longitude provided is greater than 180 or less than -180', () => {
		assert.throws(() => Location.create({ latitude: 0, longitude: 181 }));
		assert.throws(() => Location.create({ latitude: 0, longitude: -181 }));
	});

	it('should return the location as JSON', () => {
		const location = Location.create({ latitude: 0, longitude: 0 });
		assert.deepStrictEqual(location.toJSON(), { latitude: 0, longitude: 0 });
	});
});
