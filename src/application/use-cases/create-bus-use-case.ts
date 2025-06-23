import { Either, left, right } from '@/shared/types/either.js';
import { BusRepository } from '@/application/ports/repositories/bus-repository.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { Bus } from '@/domain/entities/bus.js';
import { NotAllowed } from '@/domain/errors/not-allowed.js';
import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { LicensePlate } from '@/domain/value-objects/license-plate.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { Location } from '@/domain/value-objects/location.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';

interface Right {
	bus: Bus;
}

type Left = NotAllowed | AlreadyExists;

type Output = Promise<Either<Left, Right>>;

interface Input {
	licensePlate: string;
	userId: string;
}

export class CreateBusUseCase extends UseCase<Right, Input> {
	private bus: Bus | null;

	constructor(
		private readonly busRepository: BusRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.bus = null;
	}

	async execute(input: Input): Output {
		const isLicensePaceValid = LicensePlate.isValid(input.licensePlate);

		if (!isLicensePaceValid) {
			const title = 'Invalid License Plate';
			const message = 'The provided license plate does not match the required format.';
			const error = new NotAllowed(title, message);
			return left(error);
		}

		const alreadyExists = await this.busRepository.findByLicensePlate(input.licensePlate);

		if (alreadyExists) {
			const title = 'Bus Already Exists';
			const message = 'A bus with the provided license plate is already registered.';
			const error = new AlreadyExists(title, message);
			return left(error);
		}

		this.bus = Bus.create({
			id: UUID.create(),
			licensePlate: LicensePlate.create(input.licensePlate),
			location: Location.create({ latitude: 0, longitude: 0 }),
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await this.busRepository.create(this.bus);

		await this.loggerProvider.info({
			message: 'Bus Created',
			meta: { busId: this.bus.id.value, userId: input.userId },
		});

		return right({ bus: this.bus });
	}
}
