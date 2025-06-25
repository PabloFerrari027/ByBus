import { Either, left, right } from '@/shared/types/either.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusStopRepository } from '../ports/repositories/bus-stop-repository.js';
import { TripPricingProvider } from '../ports/providers/trip-pricing-provider.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';
import { NotAcceptable } from '@/domain/errors/not-acceptable.js';
import { BusStop } from '@/domain/entities/bus-stop.js';
import { BusTripRepository } from '../ports/repositories/bus-trip-repository.js';

interface Input {
	tripId: string;
	boardingStopId: string;
	destinationStopId: string;
}

interface Right {
	priceInCents: number;
}

type Left = NotFound | NotAcceptable;
type Output = Promise<Either<Left, Right>>;

export class CalculateBusTripPriceUseCase {
	constructor(
		private readonly busTripRepository: BusTripRepository,
		private readonly busRouteRepository: BusRouteRepository,
		private readonly busStopRepository: BusStopRepository,
		private readonly tripPricingProvider: TripPricingProvider,
	) {}

	async execute(input: Input): Output {
		const busTrip = await this.busTripRepository.findById(input.tripId);

		if (!busTrip) {
			const title = 'Bus Trip Not Found';
			const message = 'The requested bus trip was not found.';
			return left(new NotFound(title, message));
		}

		const busRoute = await this.busRouteRepository.findById(busTrip.routeId.value);

		if (!busRoute) {
			const title = 'Bus Route Not Found';
			const message = 'The requested bus route was not found.';
			return left(new NotFound(title, message));
		}

		const boardingStop = await this.busStopRepository.findById(input.boardingStopId);

		if (!boardingStop) {
			const title = 'Boarding Point Not Found';
			const message = 'The requested boarding point was not found.';
			return left(new NotFound(title, message));
		}

		const destinationStop = await this.busStopRepository.findById(input.destinationStopId);

		if (!destinationStop) {
			const title = 'Destination Point Not Found';
			const message = 'The requested destination point was not found.';
			return left(new NotFound(title, message));
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

		const stops = await Promise.all(
			busRoute.stops
				.slice(start, end + 1)
				.map(async stop => (await this.busStopRepository.findById(stop.stopId.value)) as BusStop),
		);

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

		return right({ priceInCents });
	}
}
