import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { BusStopAddedToRouteEvent } from '@/domain/events/bus-stop-added-to-route-event.js';
import { BusStopRepository } from '../ports/repositories/bus-stop-repository.js';
import { Handler } from '@/shared/core/queues/handler.js';

export class CreateBusStopHandler extends Handler {
	constructor(
		private readonly busStopRepository: BusStopRepository,
		private readonly loggerProvider: LoggerProvider,
	) {
		super();
	}

	async execute(event: BusStopAddedToRouteEvent) {
		await this.busStopRepository.create(event.stop);

		await this.loggerProvider.info({
			message: 'Bus Stop Created',
			meta: { stopId: event.stop.id.value },
		});
	}
}
