import { LicensePlate, LicensePlateJSON } from '../value-objects/license-plate.js';
import { Location, LocationJSON } from '../value-objects/location.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	location: Location;
	licensePlate: LicensePlate;
	createdAt: Date;
	updatedAt: Date;
}

export interface BusJSON {
	id: UUIDJSON;
	location: LocationJSON;
	license_plate: LicensePlateJSON;
	created_at: string;
	updated_at: string;
}

export class Bus {
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

	get licensePlate(): LicensePlate {
		return this.props.licensePlate;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	updateLocation(location: Location) {
		this.props.location = location;
		this.touch();
	}

	toJSON(): BusJSON {
		return {
			id: this.props.id.toJSON(),
			license_plate: this.props.licensePlate.toJSON(),
			location: this.props.location.toJSON(),
			created_at: this.props.createdAt.toJSON(),
			updated_at: this.props.updatedAt.toJSON(),
		};
	}

	static create(props: Props) {
		return new Bus(props);
	}
}
