import { Either, left, right } from '@/shared/types/either.js';
import { BusRepository } from '@/application/ports/repositories/bus-repository.js';
import { Bus } from '@/domain/entities/bus.js';
import { Location } from '@/domain/value-objects/location.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';

interface Right {
	bus: Bus;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	busId: string;
	longitude: number;
	latitude: number;
}

export class UpdateBusLocationUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly busRepository: BusRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const location = Location.create({ latitude: input.latitude, longitude: input.longitude });
		const bus = await this.busRepository.findById(input.busId);

		if (!bus) {
			const errorTitle = 'Bus Not Found';
			const errorMessage = 'The requested bus was not found.';
			return left(new NotFound(errorTitle, errorMessage));
		}

		bus.updateLocation(location);

		await this.busRepository.save(bus);

		return right({ bus });
	}
}
