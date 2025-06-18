import { describe, it } from 'node:test';
import { UUID } from '../value-objects/uuid.js';
import { Location } from '../value-objects/location.js';
import assert from 'assert';
import { Bus } from './bus.js';
import { LicensePlate } from '../value-objects/license-plate.js';

describe('Bus', () => {
	it('should be able to create a bus', () => {
		const id = UUID.create();
		const location = Location.create({ latitude: 0, longitude: 0 });
		const licensePlate = LicensePlate.create('ABC1234');
		const createdAt = new Date();
		const updatedAt = new Date();
		const bus = Bus.create({ id, licensePlate, location, createdAt, updatedAt });
		assert.ok(bus instanceof Bus);
		assert.ok(id.equals(bus.id));
		assert.ok(location.equals(bus.location));
		assert.ok(licensePlate.equals(bus.licensePlate));
		assert.ok(createdAt.toJSON() === bus.createdAt.toJSON());
		assert.ok(updatedAt.toJSON() === bus.updatedAt.toJSON());
	});

	it('should return the bus as JSON', async () => {
		const id = UUID.create();
		const location = Location.create({ latitude: 0, longitude: 0 });
		const licensePlate = LicensePlate.create('ABC1234');
		const createdAt = new Date();
		const updatedAt = new Date();
		const bus = Bus.create({ id, licensePlate, location, createdAt, updatedAt });

		assert.deepStrictEqual(bus.toJSON(), {
			id: id.toJSON(),
			location: location.toJSON(),
			license_plate: licensePlate.toJSON(),
			created_at: createdAt.toJSON(),
			updated_at: updatedAt.toJSON(),
		});
	});
});
