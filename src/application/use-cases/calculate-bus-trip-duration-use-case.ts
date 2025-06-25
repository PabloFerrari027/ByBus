import { Either, left, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { BusStopRepository } from '../ports/repositories/bus-stop-repository.js';
import { BusStop } from '@/domain/entities/bus-stop.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusRepository } from '../ports/repositories/bus-repository.js';
import { BusTripRepository } from '../ports/repositories/bus-trip-repository.js';
import { TripEstimationProvider } from '../ports/providers/trip-estimation-provider.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';
import { NotAcceptable } from '@/domain/errors/not-acceptable.js';

interface Right {
	durationInMinutes: number;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	tripId: string;
	destinationStopId: string;
	boardingStopId: string;
}

export class CalculateBusTripDurationUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly busStopRepository: BusStopRepository,
		private readonly busRepository: BusRepository,
		private readonly busTripRepository: BusTripRepository,
		private readonly busRouteRepository: BusRouteRepository,
		private readonly tripEstimationProvider: TripEstimationProvider,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const busTrip = await this.busTripRepository.findById(input.tripId);

		if (!busTrip) {
			const title = 'Bus Trip Not Found';
			const message = 'The requested bus trip was not found.';
			return left(new NotFound(title, message));
		}

		const bus = await this.busRepository.findById(busTrip.busId.value);

		if (!bus) {
			const title = 'Bus  Not Found';
			const message = 'The requested bus was not found.';
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

		const durationInMinutes = await this.tripEstimationProvider.calculateEstimatedDuration({
			currentLocation: { latitude: bus.location.latitude, longitude: bus.location.longitude },
			endLocation: {
				latitude: destinationStop.location.latitude,
				longitude: destinationStop.location.longitude,
			},
			routeStops: stops.map(stop => ({
				latitude: stop.location.latitude,
				longitude: stop.location.longitude,
			})),
		});

		return right({ durationInMinutes });
	}
}
