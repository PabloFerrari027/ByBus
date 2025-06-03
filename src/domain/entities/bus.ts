import { Location } from '../value-objects/location.js';
import { UUID } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	location: Location;
}

export class Bus {
	private props: Props;

	constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get location(): Location {
		return this.props.location;
	}

	static create(props: Props) {
		return new Bus(props);
	}
}
