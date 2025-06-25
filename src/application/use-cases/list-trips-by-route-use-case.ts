import { Either, right } from '@/shared/types/either.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { BusTrip, Props } from '@/domain/entities/bus-trip.js';
import { BusTripRepository } from '../ports/repositories/bus-trip-repository.js';
import { BusRouteRepository } from '../ports/repositories/bus-route-repository.js';

interface Right {
	pages: number;
	trips: Array<BusTrip>;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	routeId: string;
	page?: number;
	orderBy?: string;
	ordem?: string;
}

export class ListTripsByRouteUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly busTripRepository: BusTripRepository,
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
			throw new NotFound(title, message);
		}

		const ordem = input.ordem === 'ASC' || input.ordem === 'DESC' ? input.ordem : 'DESC';
		const options: Record<string, keyof Props> = {
			id: 'id',
			start_time: 'startTime',
		};

		if (!input.orderBy) input.orderBy = 'startTime';
		const orderBy = options[input.orderBy] ?? 'startTime';
		const page = input.page ?? 1;

		const { data: trips, pages } = await this.busTripRepository.listByRouteId(input.routeId, {
			ordem,
			orderBy,
			page,
		});

		return right({ pages, trips });
	}
}
