import { Either, left, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { BusStop } from '@/domain/entities/bus-stop.js';
import { Location } from '@/domain/value-objects/location.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';

type Right = void;

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	routeId: string;
	busStops: Array<{ latitude: number; longitude: number }>;
}

export class AddBusStopsToRouteUseCase extends UseCase<Right, Input> {
	constructor(
		loggerProvider: LoggerProvider,
		private readonly busRouteRepository: BusRouteRepository,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const newBusStops = input.busStops.map(i =>
			BusStop.create({
				id: UUID.create(),
				location: Location.create({ latitude: i.latitude, longitude: i.longitude }),
			}),
		);

		const busRoute = await this.busRouteRepository.findById(input.routeId);

		if (!busRoute) {
			const title = 'Bus Route Not Found';
			const message = 'The requested bus route was not found.';
			return left(new NotFound(title, message));
		}

		newBusStops.forEach(busStop => busRoute.addStop(busStop));

		return right(undefined);
	}
}
