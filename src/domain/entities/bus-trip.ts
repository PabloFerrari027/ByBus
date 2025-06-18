import { NotAcceptable } from '../errors/not-acceptable.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	driverId: UUID;
	routeId: UUID;
	busId: UUID;
	endTime: Date | null;
	startTime: Date;
}

export interface BusTripJSON {
	id: UUIDJSON;
	driver_id: UUIDJSON;
	route_id: UUIDJSON;
	bus_id: UUIDJSON;
	end_time: string | null;
	start_time: string;
}

export class BusTrip {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get driverId(): UUID {
		return this.props.driverId;
	}

	get routeId(): UUID {
		return this.props.routeId;
	}

	get busId(): UUID {
		return this.props.busId;
	}

	get endTime(): Date | null {
		return this.props.endTime;
	}

	get startTime(): Date {
		return this.props.startTime;
	}

	get isEnded(): boolean {
		if (!this.props.endTime) return false;
		return this.props.endTime.getTime() < new Date().getTime();
	}

	get isActive(): boolean {
		return !this.endTime;
	}

	end() {
		if (this.endTime !== null) {
			const title = 'Bus Trip Is Already Ended';
			const message = 'Bus trip is already ended';
			throw new NotAcceptable(title, message);
		}
		this.props.endTime = new Date();
	}

	toJSON(): BusTripJSON {
		return {
			id: this.props.id.toJSON(),
			bus_id: this.props.busId.toJSON(),
			driver_id: this.props.driverId.toJSON(),
			route_id: this.props.routeId.toJSON(),
			start_time: this.props.startTime.toJSON(),
			end_time: this.props.endTime ? this.props.endTime.toJSON() : null,
		};
	}

	static create(props: Props) {
		return new BusTrip(props);
	}
}
