export interface Props {
	latitude: number;
	longitude: number;
}

export class Location {
	private props: Props;

	constructor(props: Props) {
		this.props = props;
	}

	get latitude(): number {
		return this.props.latitude;
	}

	get longitude(): number {
		return this.props.longitude;
	}

	public equals(other: Location): boolean {
		return this.props.latitude === other.latitude && this.props.longitude === other.longitude;
	}

	public isNear(other: Location, param: keyof Props, proximity: number): boolean {
		const diff = Math.abs(this.props[param] - other[param]);
		return diff <= proximity;
	}

	static create(props: Props): Location {
		return new Location(props);
	}
}
