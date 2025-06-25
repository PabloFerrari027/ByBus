import { Either, left, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { BusTrip } from '@/domain/entities/bus-trip.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusTripRepository } from '../ports/repositories/bus-trip-repository.js';

interface Right {
	busTrip: BusTrip;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	tripId: string;
	userId: string;
}

export class EndBusTripUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly busTripRepository: BusTripRepository,
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

		busTrip.end();

		await this.busTripRepository.save(busTrip);

		await this.loggerProvider.info({
			message: 'Bus Trip Ended',
			meta: { tripId: busTrip.id.value, userId: input.userId },
		});

		return right({ busTrip });
	}
}
