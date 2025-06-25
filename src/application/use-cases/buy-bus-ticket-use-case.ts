import { Either, left, right } from '@/shared/types/either.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { BusTicket } from '@/domain/entities/bus-ticket.js';
import { BusTicketRepository } from '../ports/repositories/bus-ticket-repository.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusTripRepository } from '../ports/repositories/bus-trip-repository.js';
import { BusStopRepository } from '../ports/repositories/bus-stop-repository.js';
import { BusTripPassenger } from '@/domain/entities/bus-trip-passenger.js';
import { BusTripPassengerRepository } from '../ports/repositories/bus-trip-passenger-repository.js';
import { PaymentStrategy } from '../strategies/payment-strategy.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { DomainEvents } from '@/infraestructure/event-bus/domain-events.js';
import { TicketPaymentEvent } from '@/domain/events/ticket-payment-event.js';
import { TripPricingProvider } from '../ports/providers/trip-pricing-provider.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';
import { NotAcceptable } from '@/domain/errors/not-acceptable.js';
import { BusStop } from '@/domain/entities/bus-stop.js';

interface Input {
	userId: string;
	tripId: string;
	boardingStopId: string;
	destinationStopId: string;
	seatNumber: number;
}

interface Right {
	ticket: BusTicket;
}

type Left = NotFound | NotAcceptable;
type Output = Promise<Either<Left, Right>>;

export class BuyBusTicketUseCase {
	private passenger: BusTripPassenger | null;
	private ticket: BusTicket | null;

	constructor(
		private readonly busTicketRepository: BusTicketRepository,
		private readonly busTripRepository: BusTripRepository,
		private readonly busRouteRepository: BusRouteRepository,
		private readonly busStopRepository: BusStopRepository,
		private readonly busTripPassengerRepository: BusTripPassengerRepository,
		private readonly paymentStrategy: PaymentStrategy,
		private readonly loggerProvider: LoggerProvider,
		private readonly tripPricingProvider: TripPricingProvider,
	) {
		this.passenger = null;
		this.ticket = null;
	}

	async execute(input: Input): Output {
		try {
			const busTrip = await this.busTripRepository.findById(input.tripId);

			if (!busTrip) {
				const title = 'Bus Trip Not Found';
				const message = 'The requested bus trip was not found.';
				return left(new NotFound(title, message));
			}

			const busRoute = await this.busRouteRepository.findById(busTrip.routeId.value);

			if (!busRoute) {
				const title = 'Bus Route Not Found';
				const message = 'The route for this bus trip was not found.';
				return left(new NotFound(title, message));
			}

			if (busRoute.isDeactivated) {
				const title = 'Bus Route Inactive';
				const message = 'The bus route is deactivated.';
				return left(new NotAcceptable(title, message));
			}

			const boardingStop = await this.busStopRepository.findById(input.boardingStopId);

			if (!boardingStop) {
				const title = 'Boarding Point Not Found';
				const message = 'The requested boarding point was not found.';
				return left(new NotFound(title, message));
			}

			if (boardingStop.isDeactivated) {
				const title = 'Boarding Inactive';
				const message = 'The boarding is deactivated.';
				return left(new NotAcceptable(title, message));
			}

			const destinationStop = await this.busStopRepository.findById(input.destinationStopId);

			if (!destinationStop) {
				const title = 'Destination Point Not Found';
				const message = 'The requested destination point was not found.';
				return left(new NotFound(title, message));
			}

			if (destinationStop.isDeactivated) {
				const title = 'Destination Inactive';
				const message = 'The destination is deactivated.';
				return left(new NotAcceptable(title, message));
			}

			const startStop = busRoute.stops.find(stop => stop.stopId.equals(boardingStop.id));
			const endStop = busRoute.stops.find(stop => stop.stopId.equals(destinationStop.id));

			if (!startStop || !endStop) {
				const title = 'Stops Not Found In Route';
				const message = 'The boarding or destination stop is not part of the route.';
				return left(new NotAcceptable(title, message));
			}

			const start = startStop.index;
			const end = endStop.index;

			if (start >= end) {
				const title = 'Invalid Route Direction';
				const message = 'The boarding stop must come before the destination stop.';
				return left(new NotAcceptable(title, message));
			}

			if (busTrip.hasPassedStop(boardingStop.id)) {
				const title = 'Boarding Stop Already Passed';
				const message = 'The boarding stop has already been passed by the bus.';
				return left(new NotAcceptable(title, message));
			}

			if (busTrip.hasPassedStop(destinationStop.id)) {
				const title = 'Destination Stop Already Passed';
				const message = 'The destination stop has already been passed by the bus.';
				return left(new NotAcceptable(title, message));
			}

			const stops = await Promise.all(
				busRoute.stops
					.slice(start, end + 1)
					.map(async stop => (await this.busStopRepository.findById(stop.stopId.value)) as BusStop),
			);

			this.passenger = await this.busTripPassengerRepository.create(
				BusTripPassenger.create({
					id: UUID.create(),
					passengerId: UUID.create(input.userId),
					seatNumber: input.seatNumber,
					tripId: busTrip.id,
				}),
			);

			await this.loggerProvider.info({
				message: 'Relationship Between Passenger And Bus Trip Created',
				meta: { tripId: busTrip.id.value, passengerId: this.passenger.id.value },
			});

			const priceInCents = await this.tripPricingProvider.calculatePrice({
				from: {
					latitude: boardingStop.location.latitude,
					longitude: boardingStop.location.longitude,
				},
				to: {
					latitude: destinationStop.location.latitude,
					longitude: destinationStop.location.longitude,
				},
				stops: stops.map(stop => ({
					latitude: stop.location.latitude,
					longitude: stop.location.longitude,
				})),
			});

			this.ticket = await this.busTicketRepository.create(
				BusTicket.create({
					id: UUID.create(),
					passengerId: UUID.create(input.userId),
					tripId: busTrip.id,
					boardingStopId: boardingStop.id,
					destinationStopId: destinationStop.id,
					seatNumber: input.seatNumber,
					status: 'PURCHASED',
					priceInCents,
					purchaseDate: new Date(),
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
				}),
			);

			await this.loggerProvider.info({
				message: 'Ticket Created',
				meta: { ticketId: this.ticket.id.value },
			});

			const paymentResult = await this.paymentStrategy.processPayment({
				userId: input.userId,
				amountInCents: this.ticket.priceInCents,
			});

			DomainEvents.dispatch([
				new TicketPaymentEvent(
					UUID.create(input.userId),
					this.ticket.id,
					this.paymentStrategy.method,
					this.paymentStrategy.provider,
					paymentResult.transactionId,
				),
			]);

			return right({ ticket: this.ticket });
		} catch (error) {
			if (this.passenger) {
				await this.busTripPassengerRepository.remove(this.passenger.id.value);
				await this.loggerProvider.warn({
					message: 'Passenger Rollback Triggered',
					meta: { passengerId: this.passenger.id.value },
				});
			}

			if (this.ticket) {
				await this.busTicketRepository.remove(this.ticket.id.value);
				await this.loggerProvider.warn({
					message: 'Ticket Rollback Triggered',
					meta: { ticketId: this.ticket.id.value },
				});
			}

			throw error;
		}
	}
}
