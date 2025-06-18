import { describe, it } from 'node:test';
import { UUID } from '../value-objects/uuid.js';
import assert from 'assert';
import { BusTrip } from './bus-trip.js';

describe('Bus Trip', () => {
	it('should be able to create a bus trip', () => {
		const id = UUID.create();
		const busId = UUID.create();
		const driverId = UUID.create();
		const routeId = UUID.create();
		const endTime = null;
		const startTime = new Date();

		const busTrip = BusTrip.create({ id, busId, driverId, endTime, routeId, startTime });

		assert.ok(busTrip instanceof BusTrip);
		assert.ok(id.equals(busTrip.id));
		assert.ok(busId.equals(busTrip.busId));
		assert.ok(driverId.equals(busTrip.driverId));
		assert.ok(routeId.equals(busTrip.routeId));
		assert.ok(busTrip.endTime === null);
		assert.ok(busTrip.isEnded === false);
		assert.ok(busTrip.isActive === true);
		assert.ok(startTime.toJSON() === busTrip.startTime?.toJSON());
	});

	it('It should be possible to end a bus trip', async () => {
		const id = UUID.create();
		const busId = UUID.create();
		const driverId = UUID.create();
		const routeId = UUID.create();
		const endTime = new Date();
		const startTime = new Date();

		const busTrip = BusTrip.create({ id, busId, driverId, endTime, routeId, startTime });
		assert.doesNotThrow(() => busTrip.end());
		busTrip.end();

		await new Promise(resolve => setTimeout(resolve, 10));

		assert.ok(busTrip.endTime instanceof Date);
		assert.ok(busTrip.isEnded === true);
		assert.ok(busTrip.isActive === false);
	});

	it('should return the bus trip as JSON', async () => {
		const id = UUID.create();
		const busId = UUID.create();
		const driverId = UUID.create();
		const routeId = UUID.create();
		const startTime = new Date();

		const busTrip = BusTrip.create({ id, busId, driverId, endTime: null, routeId, startTime });

		assert.deepStrictEqual(busTrip.toJSON(), {
			id: id.toJSON(),
			driver_id: driverId.toJSON(),
			route_id: routeId.toJSON(),
			bus_id: busId.toJSON(),
			end_time: null,
			start_time: startTime.toJSON(),
		});

		busTrip.end();
		await new Promise(resolve => setTimeout(resolve, 10));

		assert.ok(typeof busTrip.toJSON().end_time === 'string');
	});
});
