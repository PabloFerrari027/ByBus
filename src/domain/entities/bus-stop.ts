import { NotAcceptable } from '../errors/not-acceptable.js';
import { Location, LocationJSON } from '../value-objects/location.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';
import { BusRouteStop } from './bus-route-stop.js';

export type BusStopStatus = 'ACTIVE' | 'DEACTIVATED';

export interface Props {
	id: UUID;
	location: Location;
	status: BusStopStatus;
}

export interface BusStopJSON {
	id: UUIDJSON;
	location: LocationJSON;
	status: BusStopStatus;
}

export class BusStop {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get status(): BusStopStatus {
		return this.props.status;
	}

	get location(): Location {
		return this.props.location;
	}

	get isActive(): Boolean {
		return this.status === 'ACTIVE';
	}

	get isDeactivated(): Boolean {
		return this.status === 'DEACTIVATED';
	}

	active() {
		if (this.status === 'ACTIVE') {
			const title = 'Bus stop already active';
			const message = 'The bus stop is already marked as active';
			throw new NotAcceptable(title, message);
		}
		this.props.status = 'ACTIVE';
	}

	deactivate() {
		if (this.status === 'DEACTIVATED') {
			const title = 'Bus stop already deactivate';
			const message = 'The bus stop is already marked as deactivate';
			throw new NotAcceptable(title, message);
		}
		this.props.status = 'DEACTIVATED';
	}

	toJSON(): BusStopJSON {
		return {
			id: this.id.toJSON(),
			status: this.status,
			location: this.location.toJSON(),
		};
	}

	static create(props: Props): BusStop {
		return new BusStop(props);
	}
}
