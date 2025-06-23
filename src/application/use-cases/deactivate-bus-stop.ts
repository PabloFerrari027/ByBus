import { Either, left, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusStopRepository } from '../ports/repositories/bus-stop-repository.js';
import { BusStop } from '@/domain/entities/bus-stop.js';

interface Right {
	busStop: BusStop;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	stopId: string;
	userId: string;
}

export class DeactivateBusStopUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly busStopRepository: BusStopRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const busStop = await this.busStopRepository.findById(input.stopId);

		if (!busStop) {
			const title = 'Bus Stop Not Found';
			const message = 'The requested bus stop was not found.';
			return left(new NotFound(title, message));
		}

		busStop.deactivate();

		await this.busStopRepository.save(busStop);

		await this.loggerProvider.info({
			message: 'Bus Stop Deactivated',
			meta: { routeId: busStop.id.value, userId: input.userId },
		});

		return right({ busStop });
	}
}
