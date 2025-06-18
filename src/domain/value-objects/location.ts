import { NotAcceptable } from '../errors/not-acceptable.js';

export interface Props {
	latitude: number;
	longitude: number;
}

export interface LocationJSON {
	latitude: number;
	longitude: number;
}

export class Location {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get latitude(): number {
		return this.props.latitude;
	}

	get longitude(): number {
		return this.props.longitude;
	}

	public equals(other: Location): boolean {
		return this.latitude === other.latitude && this.longitude === other.longitude;
	}

	public isNear(other: Location, param: keyof Props, proximity: number): boolean {
		const diff = Math.abs(this[param] - other[param]);
		return diff <= proximity;
	}

	public toJSON(): LocationJSON {
		return {
			latitude: this.latitude,
			longitude: this.longitude,
		};
	}

	static create(props: Props): Location {
		const { latitude, longitude } = props;

		if (latitude < -90 || latitude > 90) {
			const title = 'Invalid Latitude';
			const message = 'It must be between -90 and 90';
			throw new NotAcceptable(title, message);
		}

		if (longitude < -180 || longitude > 180) {
			const title = 'Invalid longitude';
			const message = 'It must be between -180 and 180';
			throw new NotAcceptable(title, message);
		}

		return new Location(props);
	}
}
