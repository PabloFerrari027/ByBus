import { describe, it } from 'node:test';
import { BusRoute } from './bus-route.js';
import { UUID } from '../value-objects/uuid.js';
import { BusStop } from './bus-stop.js';
import { Location } from '../value-objects/location.js';
import assert from 'assert';

describe('Bus Route', () => {
	it('should be able to create a bus route', () => {
		const id = UUID.create();
		const stops: Array<BusStop> = [];
		const busRoute = BusRoute.create({ id, stops });
		assert.ok(busRoute instanceof BusRoute);
		assert.ok(id.equals(busRoute.id));
		assert.ok(busRoute.id instanceof UUID);
		assert.ok(busRoute.stops === stops);
	});

	it('should be able to add stop', () => {
		const busRoute = BusRoute.create({ id: UUID.create(), stops: [] });
		const location = Location.create({ latitude: 0, longitude: 0 });
		const busStop = BusStop.create({ id: UUID.create(), location });
		busRoute.addStop(busStop);
		assert.ok(busRoute.stops[0].location.equals(location));
	});

	it('should be able to throw an error if the bus stop already exists', () => {
		const busRoute = BusRoute.create({ id: UUID.create(), stops: [] });
		const location = Location.create({ latitude: 0, longitude: 0 });
		const busStop = BusStop.create({ id: UUID.create(), location });
		busRoute.addStop(busStop);
		assert.throws(() => busRoute.addStop(busStop));
	});

	it('should return the bus route as JSON', () => {
		const id = UUID.create();
		const stops: Array<BusStop> = [];
		const location = Location.create({ latitude: 0, longitude: 0 });
		const busStop = BusStop.create({ id: UUID.create(), location });
		stops.push(busStop);
		const busRoute = BusRoute.create({ id, stops });
		assert.deepStrictEqual(busRoute.toJSON(), {
			id: id.toJSON(),
			stops: stops.map(i => i.toJSON()),
		});
	});
});
