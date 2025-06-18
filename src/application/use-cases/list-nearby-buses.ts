import { Either, left, right } from '@/shared/types/either.js';
import { BusRepository } from '@/application/ports/repositories/bus-repository.js';
import { Bus } from '@/domain/entities/bus.js';
import { NotAllowed } from '@/domain/errors/not-allowed.js';
import { Location } from '@/domain/value-objects/location.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';

interface Right {
	buses: Array<Bus>;
}

type Left = NotAllowed;

type Output = Promise<Either<Left, Right>>;

interface Input {
	radius: number;
	latitude: number;
	longitude: number;
}

export class ListNearbyBuses extends UseCase<Right, Input> {
	constructor(
		private readonly busRepository: BusRepository,
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

		const { data: buses } = await this.busRepository.listByCoordinates(
			location.latitude,
			location.longitude,
			input.radius,
		);

		return right({ buses });
	}
}
