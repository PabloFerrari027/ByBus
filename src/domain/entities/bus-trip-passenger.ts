import { NotAcceptable } from '../errors/not-acceptable.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export type BusTripPassengerStatus = 'ACTIVE' | 'DEACTIVATED';

export interface Props {
	id: UUID;
	passengerId: UUID;
	tripId: UUID;
	seatNumber: number;
}

export interface BusTripPassengerJSON {
	id: UUIDJSON;
	passenger_id: UUIDJSON;
	trip_id: UUIDJSON;
	seat_number: number;
}

export class BusTripPassenger {
	private readonly props: Props;

	private constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get passengerId(): UUID {
		return this.props.passengerId;
	}

	get tripId(): UUID {
		return this.props.tripId;
	}

	get seatNumber(): number {
		return this.props.seatNumber;
	}

	equals(passenger: BusTripPassenger): Boolean {
		return JSON.stringify(this.toJSON()) === JSON.stringify(passenger.toJSON());
	}

	toJSON(): BusTripPassengerJSON {
		return {
			id: this.id.toJSON(),
			passenger_id: this.passengerId.toJSON(),
			trip_id: this.tripId.toJSON(),
			seat_number: this.seatNumber,
		};
	}

	static create(props: Props): BusTripPassenger {
		if (props.seatNumber < 1) {
			const title = 'Invalid Seat Number';
			const message = 'The seat number must be greater than or equal to 1.';
			throw new NotAcceptable(title, message);
		}

		return new BusTripPassenger(props);
	}
}
