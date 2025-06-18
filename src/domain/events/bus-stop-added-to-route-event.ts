import { BusRoute } from '../entities/bus-route.js';
import { BusStop } from '../entities/bus-stop.js';
import { Event } from './event.js';

export class BusStopAddedToRouteEvent extends Event {
	public occurredOn: Date;

	constructor(
		public readonly route: BusRoute,
		public readonly stop: BusStop,
	) {
		super();
		this.occurredOn = new Date();
	}
}
