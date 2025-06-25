import { AlreadyExists } from '../errors/already-exists.js';
import { NotAcceptable } from '../errors/not-acceptable.js';
import { BusCode } from '../value-objects/bus-code.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';
import { BusRouteStop, BusRouteStopJSON } from './bus-route-stop.js';

export type BusRouteStatus = 'ACTIVE' | 'DEACTIVATED';

export interface Props {
	id: UUID;
	status: BusRouteStatus;
	code: BusCode;
	stops: Array<BusRouteStop>;
	createdAt: Date;
}

export interface BusRouteJSON {
	id: UUIDJSON;
	status: BusRouteStatus;
	code: string;
	stops: Array<BusRouteStopJSON>;
	created_at: string;
}

export class BusRoute {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get status(): BusRouteStatus {
		return this.props.status;
	}

	get code(): BusCode {
		return this.props.code;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get stops(): Array<BusRouteStop> {
		return this.props.stops;
	}

	get isActive(): boolean {
		return this.status === 'ACTIVE';
	}

	get isDeactivated(): boolean {
		return this.status === 'DEACTIVATED';
	}

	active() {
		if (this.status === 'ACTIVE') {
			const title = 'Bus route already active';
			const message = 'The bus route is already marked as active';
			throw new NotAcceptable(title, message);
		}
		this.props.status = 'ACTIVE';
	}

	deactivate() {
		if (this.status === 'DEACTIVATED') {
			const title = 'Bus route already deactivate';
			const message = 'The bus route is already marked as deactivate';
			throw new NotAcceptable(title, message);
		}
		this.props.status = 'DEACTIVATED';
	}

	addStop(stop: BusRouteStop): void {
		const alreadyExists = this.stops.find(existing => existing.equals(stop));

		if (alreadyExists) {
			throw new AlreadyExists(
				'Bus Stop Already Exists',
				'The bus stop you are trying to add is already present in this route.',
			);
		}

		this.stops.push(stop);
	}

	removeStop(stopId: UUID | string) {
		this.props.stops = this.stops.filter(stop => stop.stopId.equals(stopId));
	}

	toJSON(): BusRouteJSON {
		return {
			id: this.id.toJSON(),
			status: this.status,
			code: this.code.value,
			stops: this.stops.map(stop => stop.toJSON()),
			created_at: this.createdAt.toJSON(),
		};
	}

	static create(props: Props): BusRoute {
		return new BusRoute(props);
	}
}
