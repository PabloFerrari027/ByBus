import { Either, left, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';
import { BusRouteStopRepository } from '../ports/repositories/bus-route-stop-repository.js';
import { NotAcceptable } from '@/domain/errors/not-acceptable.js';

type Right = void;

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	routeId: string;
	userId: string;
	busStops: Array<string>;
}

export class RemoveBusStopsToRouteUseCase extends UseCase<Right, Input> {
	constructor(
		loggerProvider: LoggerProvider,
		private readonly busRouteRepository: BusRouteRepository,
		private readonly busRouteStopRepository: BusRouteStopRepository,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const busRoute = await this.busRouteRepository.findById(input.routeId);

		if (!busRoute) {
			const title = 'Bus Route Not Found';
			const message = 'The requested bus route was not found.';
			return left(new NotFound(title, message));
		}

		if (busRoute.isDeactivated) {
			const title = 'Route Inactive';
			const message = 'You cannot edit an inactive route.';
			return left(new NotAcceptable(title, message));
		}

		for await (const stopId of input.busStops) {
			busRoute.removeStop(stopId);

			await this.busRouteStopRepository.remove(stopId);

			await this.loggerProvider.info({
				message: 'Bus Stop Removed',
				meta: { routeId: busRoute.id.value, stopId, userId: input.userId },
			});
		}

		return right(undefined);
	}
}
