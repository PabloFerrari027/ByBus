import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export interface Props {
	id: UUID;
	tripId: UUID;
	stopId: UUID;
	passedAt: Date;
}

export interface PassedBusStopJSON {
	id: UUIDJSON;
	trip_id: UUIDJSON;
	stop_id: UUIDJSON;
	passed_at: string;
}

export class PassedBusStop {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get stopId(): UUID {
		return this.props.stopId;
	}

	get tripId(): UUID {
		return this.props.tripId;
	}

	get passedAt(): Date {
		return this.props.passedAt;
	}

	toJSON(): PassedBusStopJSON {
		return {
			id: this.id.toJSON(),
			stop_id: this.stopId.toJSON(),
			trip_id: this.tripId.toJSON(),
			passed_at: this.passedAt.toJSON(),
		};
	}

	static create(props: Props): PassedBusStop {
		return new PassedBusStop(props);
	}
}
