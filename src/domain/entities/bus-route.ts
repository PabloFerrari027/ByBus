import { AlreadyExists } from '../errors/already-exists.js';
import { UUID } from '../value-objects/uuid.js';
import { BusStop } from './bus-stop.js';

export interface Props {
	id: UUID;
	stops: Array<BusStop>;
}

export class BusRoute {
	private props: Props;

	constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get stops(): Array<BusStop> {
		return this.props.stops;
	}

	addStop(stop: BusStop): void {
		const alreadyExists = this.stops.find(i => i.equals(stop));
		if (alreadyExists) {
			const title = 'Bus Stop Already Exists';
			const message = 'The bus stop you are trying to add is already present in this route.';
			throw new AlreadyExists(title, message);
		} else {
			this.props.stops.push(stop);
		}
	}

	static create(props: Props) {
		return new BusRoute(props);
	}
}
