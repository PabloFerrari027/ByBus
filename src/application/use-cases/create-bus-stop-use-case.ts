import { BusStopRepository } from '@/application/ports/repositories/bus-stop-repository.js';
import { Either, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusStop } from '@/domain/entities/bus-stop.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { Location } from '@/domain/value-objects/location.js';

interface Right {
	busStop: BusStop;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	latitude: number;
	longitude: number;
	userId: string;
}

export class CreateBusRouteUseCase extends UseCase<Right, Input> {
	constructor(
		loggerProvider: LoggerProvider,
		private readonly busStopRepository: BusStopRepository,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const busStop = BusStop.create({
			id: UUID.create(),
			status: 'ACTIVE',
			location: Location.create({ latitude: input.latitude, longitude: input.longitude }),
			routes: [],
		});

		await this.busStopRepository.create(busStop);

		await this.loggerProvider.info({
			message: 'Bus Stop Created',
			meta: { routeId: busStop.id.value, userid: input.userId },
		});

		return right({ busStop });
	}
}
