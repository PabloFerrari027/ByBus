import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { RefreshTokenUseCase } from '@/application/use-cases/refresh-token-use-case.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { RefreshTokenMapper } from '../mappers/refresh-token-mapper.js';

interface Body {
	access_token: string;
	refresh_token: string;
}

export class RefreshTokenController extends Controller {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
		private readonly tokenStrategy: TokenStrategy,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const body = input.body as unknown as Body;
		const useCase = new RefreshTokenUseCase(
			this.usersRepository,
			this.sessionsRepository,
			this.tokenStrategy,
			this.loggerProvider,
		);
		const response = await useCase.handle(RefreshTokenMapper.fromRequest(body));
		const isRight = response.isRight();
		if (isRight) {
			const data = RefreshTokenMapper.toResponse(response.value);
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
