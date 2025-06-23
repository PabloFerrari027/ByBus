import { Either, left, right } from '@/shared/types/either.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';
import { BusRoute } from '@/domain/entities/bus-route.js';
import { NotFound } from '@/domain/errors/not-found.js';

interface Right {
	busRoute: BusRoute;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	routeId: string;
	userId: string;
}

export class ReactivateBusRouteUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly busRouteRepository: BusRouteRepository,
		loggerProvider: LoggerProvider,
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

		busRoute.active();

		await this.busRouteRepository.save(busRoute);

		await this.loggerProvider.info({
			message: 'Bus Route Reactivated',
			meta: { routeId: busRoute.id.value, userId: input.userId },
		});

		return right({ busRoute });
	}
}
