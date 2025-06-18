import { describe, it } from 'node:test';
import { BusStop } from './bus-stop.js';
import { UUID } from '../value-objects/uuid.js';
import { Location } from '../value-objects/location.js';
import assert from 'assert';

describe('Bus Stop', () => {
	it('should be able to create a bus stop', () => {
		const id = UUID.create();
		const location = Location.create({ latitude: 0, longitude: 0 });
		const busStop = BusStop.create({ id, location });
		assert.ok(busStop instanceof BusStop);
		assert.ok(location.equals(busStop.location));
		assert.ok(id.equals(busStop.id));
	});

	it('should return the bus stop as JSON', () => {
		const id = UUID.create();
		const location = Location.create({ latitude: 0, longitude: 0 });
		const busStop = BusStop.create({ id, location });
		assert.deepStrictEqual(busStop.toJSON(), {
			id: id.toJSON(),
			location: location.toJSON(),
		});
	});
});
