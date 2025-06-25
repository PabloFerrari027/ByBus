import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export type BusTicketStatus = 'PURCHASED' | 'CANCELLED';

export interface Props {
	id: UUID;
	passengerId: UUID;
	tripId: UUID;
	boardingStopId: UUID;
	destinationStopId: UUID;
	status: BusTicketStatus;
	priceInCents: number;
	seatNumber: number;
	purchaseDate: Date;
	expiresAt: Date;
}

export interface BusTicketJSON {
	id: UUIDJSON;
	passenger_id: UUIDJSON;
	trip_id: UUIDJSON;
	boarding_stop_id: UUIDJSON;
	destination_stop_id: UUIDJSON;
	status: BusTicketStatus;
	price_in_cents: number;
	seat_number: number;
	purchase_date: string;
	expires_at: string;
}

export class BusTicket {
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

	get boardingStopId(): UUID {
		return this.props.boardingStopId;
	}

	get destinationStopId(): UUID {
		return this.props.destinationStopId;
	}

	get status(): BusTicketStatus {
		return this.props.status;
	}

	get priceInCents(): number {
		return this.props.priceInCents;
	}

	get seatNumber(): number {
		return this.props.seatNumber;
	}

	get purchaseDate(): Date {
		return this.props.purchaseDate;
	}

	get expiresAt(): Date {
		return this.props.expiresAt;
	}

	toJSON(): BusTicketJSON {
		return {
			id: this.id.value,
			passenger_id: this.passengerId.value,
			trip_id: this.tripId.value,
			boarding_stop_id: this.boardingStopId.value,
			destination_stop_id: this.destinationStopId.value,
			status: this.status,
			price_in_cents: this.priceInCents,
			seat_number: this.seatNumber,
			purchase_date: this.purchaseDate.toJSON(),
			expires_at: this.expiresAt.toJSON(),
		};
	}

	static create(props: Props): BusTicket {
		return new BusTicket(props);
	}
}
