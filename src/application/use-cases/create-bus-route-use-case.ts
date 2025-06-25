import { BusStopRepository } from '@/application/ports/repositories/bus-stop-repository.js';
import { Either, left, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { BusRoute } from '@/domain/entities/bus-route.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';
import { BusRouteStop } from '@/domain/entities/bus-route-stop.js';
import { BusRouteStopRepository } from '../ports/repositories/bus-route-stop-repository.js';
import { BusCode } from '@/domain/value-objects/bus-code.js';

interface Right {
	busRoute: BusRoute;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	userId: string;
	code: string;
	busStops: Array<{ id: string; index: number }>;
}

export class CreateBusRouteUseCase extends UseCase<Right, Input> {
	constructor(
		loggerProvider: LoggerProvider,
		private readonly busRouteRepository: BusRouteRepository,
		private readonly busStopRepository: BusStopRepository,
		private readonly busRouteStopRepository: BusRouteStopRepository,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const busCode = BusCode.create(input.code);

		const busRoute = BusRoute.create({
			id: UUID.create(),
			status: 'ACTIVE',
			code: busCode,
			stops: [],
			createdAt: new Date(),
		});

		for await (const { id, index } of input.busStops) {
			const stop = await this.busStopRepository.findById(id);

			if (!stop) {
				const title = 'Bus Stop Not Found';
				const message = 'The requested bus stop was not found.';
				return left(new NotFound(title, message));
			}

			const busRouteStop = BusRouteStop.create({
				id: UUID.create(),
				routeId: busRoute.id,
				stopId: stop.id,
				index,
			});

			await this.busRouteStopRepository.create(busRouteStop);

			await this.loggerProvider.info({
				message: 'Bus Route Stop Created',
				meta: { routeId: busRoute.id.value, stopId: stop.id.value },
			});

			busRoute.addStop(busRouteStop);
		}

		await this.busRouteRepository.create(busRoute);

		await this.loggerProvider.info({
			message: 'Bus Route Created',
			meta: { routeId: busRoute.id.value, userId: input.userId },
		});

		return right({ busRoute });
	}
}
