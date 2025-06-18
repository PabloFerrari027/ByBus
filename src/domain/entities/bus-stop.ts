import { Location, LocationJSON } from '../value-objects/location.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	location: Location;
}

export interface BusStopJSON {
	id: UUIDJSON;
	location: LocationJSON;
}

export class BusStop {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get location(): Location {
		return this.props.location;
	}

	toJSON(): BusStopJSON {
		return {
			id: this.id.toJSON(),
			location: this.location.toJSON(),
		};
	}

	static create(props: Props): BusStop {
		return new BusStop(props);
	}
}
