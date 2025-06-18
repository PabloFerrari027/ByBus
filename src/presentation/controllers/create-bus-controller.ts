import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { CreateBusUseCase } from '@/application/use-cases/create-bus-use-case.js';
import { BusRepository } from '@/application/ports/repositories/bus-repository.js';
import { CreateBusMapper } from '../mappers/create-bus-mapper.js';

export class CreateBusController extends Controller {
	constructor(
		private busRepository: BusRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const body = input.body;
		const useCase = new CreateBusUseCase(this.busRepository, this.loggerProvider);
		const response = await useCase.handle(CreateBusMapper.fromRequest(body));
		if (response.isRight()) {
			const data = CreateBusMapper.toResponse(response.value.bus);
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
