import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	routeId: UUID;
	stopId: UUID;
}

export interface BusRouteStopJSON {
	id: UUIDJSON;
	route_id: UUIDJSON;
	stop_id: UUIDJSON;
}

export class BusRouteStop {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get routeId(): UUID {
		return this.props.routeId;
	}

	get stopId(): UUID {
		return this.props.stopId;
	}

	toJSON(): BusRouteStopJSON {
		return {
			id: this.id.toJSON(),
			route_id: this.routeId.toJSON(),
			stop_id: this.stopId.toJSON(),
		};
	}

	equals(busRoute: BusRouteStop): Boolean {
		return JSON.stringify(this.toJSON()) === JSON.stringify(busRoute.toJSON());
	}

	static create(props: Props): BusRouteStop {
		return new BusRouteStop(props);
	}
}
