import { AlreadyExists } from '../errors/already-exists.js';
import { NotAcceptable } from '../errors/not-acceptable.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';
import { BusTripPassenger, BusTripPassengerJSON } from './bus-trip-passenger.js';
import { PassedBusStop, PassedBusStopJSON } from './passed-bus-stop.js';

export interface Props {
	id: UUID;
	driverId: UUID;
	routeId: UUID;
	busId: UUID;
	passengers: Array<BusTripPassenger>;
	passedStops: Array<PassedBusStop>;
	endTime: Date | null;
	startTime: Date | null;
}

export interface BusTripJSON {
	id: UUIDJSON;
	driver_id: UUIDJSON;
	route_id: UUIDJSON;
	bus_id: UUIDJSON;
	passengers: Array<BusTripPassengerJSON>;
	passed_stops: Array<PassedBusStopJSON>;
	end_time: string | null;
	start_time: string | null;
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

	get passengers(): Array<BusTripPassenger> {
		return this.props.passengers;
	}

	get passedStops(): Array<PassedBusStop> {
		return this.props.passedStops;
	}

	get endTime(): Date | null {
		return this.props.endTime;
	}

	get startTime(): Date | null {
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

	addPassenger(passenger: BusTripPassenger): void {
		const alreadyExists = this.passengers.find(existing =>
			existing.passengerId.equals(passenger.passengerId),
		);

		if (alreadyExists) {
			throw new AlreadyExists(
				'Passenger Already Exists',
				'The passenger you are trying to add is already present in this trip.',
			);
		}

		const seatAlreadyOccupied = this.passengers.find(existing => existing.equals(passenger));

		if (seatAlreadyOccupied) {
			const title = 'Seat Already Occupied';
			const message = 'The selected seat is already occupied by another passenger.';
			throw new AlreadyExists(title, message);
		}

		this.passengers.push(passenger);
	}

	addPassedStop(passedStop: PassedBusStop): void {
		const alreadyExists = this.passedStops.find(existing =>
			existing.stopId.equals(passedStop.stopId),
		);

		if (alreadyExists) {
			throw new AlreadyExists(
				'Passed Stop Already Exists',
				'The passed stop you are trying to add is already present in this trip.',
			);
		}
	}

	removePassenger(passengerId: UUID | string) {
		this.props.passengers = this.passengers.filter(passenger =>
			passenger.passengerId.equals(passengerId),
		);
	}

	removePassedStop(stopId: UUID | string) {
		this.props.passedStops = this.passedStops.filter(stop => stop.stopId.equals(stopId));
	}

	hasPassedStop(stopId: string | UUID): boolean {
		return this.passedStops.some(stop => stop.id.equals(stopId));
	}

	lastPassedStop(): PassedBusStop | null {
		return this.passedStops.sort((a, b) => a.passedAt.getTime() - b.passedAt.getTime())[0] ?? null;
	}

	toJSON(): BusTripJSON {
		return {
			id: this.props.id.toJSON(),
			bus_id: this.props.busId.toJSON(),
			driver_id: this.props.driverId.toJSON(),
			route_id: this.props.routeId.toJSON(),
			passengers: this.passengers.map(i => i.toJSON()),
			passed_stops: this.passedStops.map(i => i.toJSON()),
			start_time: this.props.startTime?.toJSON() ?? null,
			end_time: this.props.endTime ? this.props.endTime.toJSON() : null,
		};
	}

	static create(props: Props) {
		return new BusTrip(props);
	}
}
