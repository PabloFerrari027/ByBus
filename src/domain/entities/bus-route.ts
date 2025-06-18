import { DomainEvents } from '@/infraestructure/event-bus/domain-events.js';
import { AlreadyExists } from '../errors/already-exists.js';
import { NotAcceptable } from '../errors/not-acceptable.js';
import { BusStopAddedToRouteEvent } from '../events/bus-stop-added-to-route-event.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';
import { BusStop, BusStopJSON } from './bus-stop.js';

export type BusRouteStatus = 'ACTIVE' | 'DEACTIVATED';

export interface Props {
	id: UUID;
	status: BusRouteStatus;
	stops: Array<BusStop>;
}

export interface BusRouteJSON {
	id: UUIDJSON;
	status: BusRouteStatus;
	stops: Array<BusStopJSON>;
}

export class BusRoute {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get status(): BusRouteStatus {
		return this.props.status;
	}

	get stops(): Array<BusStop> {
		return this.props.stops;
	}

	get isActive(): boolean {
		return this.status === 'ACTIVE';
	}

	get isDeactivated(): boolean {
		return this.status === 'DEACTIVATED';
	}

	active() {
		if (this.status === 'ACTIVE') {
			const title = 'Bus route already active';
			const message = 'The bus route is already marked as active';
			throw new NotAcceptable(title, message);
		}
		this.props.status = 'ACTIVE';
	}

	deactivate() {
		if (this.status === 'DEACTIVATED') {
			const title = 'Bus route already deactivate';
			const message = 'The bus route is already marked as deactivate';
			throw new NotAcceptable(title, message);
		}
		this.props.status = 'DEACTIVATED';
	}

	addStop(stop: BusStop): void {
		const alreadyExists = this.stops.find(existing => existing.location.equals(stop.location));

		if (alreadyExists) {
			throw new AlreadyExists(
				'Bus Stop Already Exists',
				'The bus stop you are trying to add is already present in this route.',
			);
		}

		this.stops.push(stop);
		DomainEvents.dispatch([new BusStopAddedToRouteEvent(this, stop)]);
	}

	toJSON(): BusRouteJSON {
		return {
			id: this.id.toJSON(),
			status: this.status,
			stops: this.stops.map(stop => stop.toJSON()),
		};
	}

	static create(props: Props): BusRoute {
		return new BusRoute(props);
	}
}
