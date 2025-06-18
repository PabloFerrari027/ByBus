import { Either, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { BusRoute } from '@/domain/entities/bus-route.js';
import { BusStop } from '@/domain/entities/bus-stop.js';
import { Location } from '@/domain/value-objects/location.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';

interface Right {
	busRoute: BusRoute;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	busStops: Array<{ latitude: number; longitude: number }>;
}

export class CreateBusRouteUseCase extends UseCase<Right, Input> {
	constructor(
		loggerProvider: LoggerProvider,
		private readonly busRouteRepository: BusRouteRepository,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const busStops = input.busStops.map(i =>
			BusStop.create({
				id: UUID.create(),
				location: Location.create({ latitude: i.latitude, longitude: i.longitude }),
			}),
		);

		const busRoute = BusRoute.create({
			id: UUID.create(),
			stops: busStops,
			status: 'ACTIVE',
		});

		await this.busRouteRepository.create(busRoute);

		await this.loggerProvider.info({
			message: 'Bus Route Created',
			meta: { routeId: busRoute.id.value },
		});

		return right({ busRoute });
	}
}
