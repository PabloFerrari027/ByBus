import { Name, NameJSON } from '../value-objects/name.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	name: Name;
	tripCount: number;
}

export interface DriverJSON {
	id: UUIDJSON;
	name: NameJSON;
	trip_count: number;
}

export class Driver {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get name(): Name {
		return this.props.name;
	}

	get tripCount(): number {
		return this.props.tripCount;
	}

	public incrementTripCount(): void {
		this.props.tripCount += 1;
	}

	toJSON(): DriverJSON {
		return {
			id: this.props.id.toJSON(),
			name: this.props.name.toJSON(),
			trip_count: this.props.tripCount,
		};
	}

	static create(props: Props): Driver {
		return new Driver(props);
	}
}
