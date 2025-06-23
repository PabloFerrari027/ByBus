import { Either, left, right } from '@/shared/types/either.js';
import { BusRepository } from '@/application/ports/repositories/bus-repository.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { BusTrip } from '@/domain/entities/bus-trip.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { DriverRepository } from '../ports/repositories/driver-repository.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { BusTripRepository } from '../ports/repositories/bus-trip-repository.js';

interface Right {
	busTrip: BusTrip;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	driverId: string;
	routeId: string;
	busId: string;
}

export class StartBusTripUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly busRepository: BusRepository,
		private readonly driverRepository: DriverRepository,
		private readonly busRouteRepository: BusRouteRepository,
		private readonly busTripRepository: BusTripRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const bus = await this.busRepository.findById(input.busId);

		if (!bus) {
			const title = 'Bus Not Found';
			const message = 'The requested bus was not found.';
			return left(new NotFound(title, message));
		}

		const driver = await this.driverRepository.findById(input.driverId);

		if (!driver) {
			const title = 'Driver Not Found';
			const message = 'The requested driver was not found.';
			return left(new NotFound(title, message));
		}

		const busRoute = await this.busRouteRepository.findById(input.routeId);

		if (!busRoute) {
			const title = 'Bus Route Not Found';
			const message = 'The requested bus route was not found.';
			return left(new NotFound(title, message));
		}

		if (busRoute.isDeactivated) {
			const title = 'Bus Route Is Deactivated';
			const message = 'The bus route is deactivated.';
			return left(new NotFound(title, message));
		}

		const busTrip = BusTrip.create({
			id: UUID.create(),
			busId: bus.id,
			driverId: driver.id,
			endTime: null,
			routeId: busRoute.id,
			startTime: new Date(),
		});

		await this.busTripRepository.create(busTrip);

		await this.loggerProvider.info({
			message: 'Bus Trip Started',
			meta: { tripId: busTrip.id.value },
		});

		return right({ busTrip });
	}
}
