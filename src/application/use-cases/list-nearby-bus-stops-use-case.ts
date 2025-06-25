import { Either, left, right } from '@/shared/types/either.js';
import { NotAllowed } from '@/domain/errors/not-allowed.js';
import { Location } from '@/domain/value-objects/location.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { BusStop } from '@/domain/entities/bus-stop.js';
import { BusStopRepository } from '../ports/repositories/bus-stop-repository.js';

interface Right {
	busStops: Array<BusStop>;
}

type Left = NotAllowed;

type Output = Promise<Either<Left, Right>>;

interface Input {
	radius: number;
	latitude: number;
	longitude: number;
}

export class ListNearbyBusStopsUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly busStopRepository: BusStopRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		if (input.radius <= 0) {
			const title = 'Invalid Radius';
			const message = 'Radius must be greater than zero.';
			return left(new NotAllowed(title, message));
		}

		const location = Location.create({ latitude: input.latitude, longitude: input.longitude });

		const { data: busStops } = await this.busStopRepository.listByCoordinates(
			location.latitude,
			location.longitude,
			input.radius,
		);

		return right({ busStops });
	}
}
