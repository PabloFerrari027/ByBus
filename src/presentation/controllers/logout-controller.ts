import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { LogoutUseCase } from '@/application/use-cases/logout-use-case.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { LogoutMapper } from '../mappers/logout-mapper.js';

interface Body {
	session_id: string;
}

export class LogoutController extends Controller {
	constructor(
		private readonly sessionsRepository: SessionsRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const body = input.body as unknown as Body;
		const useCase = new LogoutUseCase(this.sessionsRepository, this.loggerProvider);
		const response = await useCase.handle(LogoutMapper.fromRequest(body));
		const isRight = response.isRight();
		if (isRight) return { status: 200, data: LogoutMapper.toResponse(response.value) };
		else throw response.value;
	}
}
