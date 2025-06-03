import { UUID } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	driverId: UUID;
	routeId: UUID;
	busId: UUID;
	endTime: Date | null;
	startTime: Date;
}

export class BusTrip {
	private props: Props;

	constructor(props: Props) {
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

	public ended(): boolean {
		if (!this.endTime) return false;
		return this.endTime.getTime() < new Date().getTime();
	}

	public active(): boolean {
		return !this.endTime;
	}

	static create(props: Props) {
		return new BusTrip(props);
	}
}
