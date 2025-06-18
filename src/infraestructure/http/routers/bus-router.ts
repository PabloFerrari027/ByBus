import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { RouteDefinition } from '@/shared/core/http/router.js';
import { CreateBusController } from '@/presentation/controllers/create-bus-controller.js';
import { ValidateBusCreationRequest } from '@/presentation/middlewares/validate-bus-creation-request.js';
import { BusRepository } from '@/application/ports/repositories/bus-repository.js';

export class BusRouter {
	private _routes: RouteDefinition[];

	constructor(
		private readonly loggerProvider: LoggerProvider,
		private readonly busRepository: BusRepository,
	) {
		this._routes = [];
		const createBusController = new CreateBusController(this.busRepository, this.loggerProvider);
		const validateBusCreationRequest = new ValidateBusCreationRequest(this.loggerProvider);

		this._routes.push({
			method: 'post',
			path: '/bus/create',
			handler: createBusController,
			middlewares: [validateBusCreationRequest],
		});
	}

	get routes(): RouteDefinition[] {
		return this._routes;
	}
}
