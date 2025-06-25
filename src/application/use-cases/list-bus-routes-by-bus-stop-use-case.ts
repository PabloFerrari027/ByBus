import { Either, right } from '@/shared/types/either.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { BusStopRepository } from '../ports/repositories/bus-stop-repository.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusRoute, Props } from '@/domain/entities/bus-route.js';

interface Right {
	pages: number;
	routes: Array<BusRoute>;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	stopId: string;
	page?: number;
	orderBy?: string;
	ordem?: string;
}

export class ListBusRoutesByBusStop extends UseCase<Right, Input> {
	constructor(
		private readonly busStopRepository: BusStopRepository,
		private readonly busRouteRepository: BusRouteRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const busStop = await this.busStopRepository.findById(input.stopId);

		if (!busStop) {
			const title = 'Bus Stop Not Found';
			const message = 'The requested bus stop was not found.';
			throw new NotFound(title, message);
		}

		const ordem = input.ordem === 'ASC' || input.ordem === 'DESC' ? input.ordem : 'DESC';
		const options: Record<string, keyof Props> = {
			id: 'id',
			created_at: 'createdAt',
		};

		if (!input.orderBy) input.orderBy = 'createdAt';
		const orderBy = options[input.orderBy] ?? 'createdAt';
		const page = input.page ?? 1;

		const { data: routes, pages } = await this.busRouteRepository.listByStopId(input.stopId, {
			ordem,
			orderBy,
			page,
		});

		return right({ pages, routes });
	}
}
