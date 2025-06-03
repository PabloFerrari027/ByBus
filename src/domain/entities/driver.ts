import { Name } from '../value-objects/name.js';
import { UUID } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	name: Name;
	tripCount: number;
}

export class Driver {
	private props: Props;

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

	static create(props: Props): Driver {
		return new Driver(props);
	}
}
