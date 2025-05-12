import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { RefreshTokenUseCase } from '@/application/use-cases/refresh-token-use-case.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';

interface Body {
	access_token: string;
	refresh_token: string;
}

export class LoginController extends Controller {
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
		const accessToken = body.access_token;
		const refreshToken = body.refresh_token;
		const useCase = new RefreshTokenUseCase(
			this.usersRepository,
			this.sessionsRepository,
			this.tokenStrategy,
			this.loggerProvider,
		);
		const response = await useCase.hanlde({ accessToken, refreshToken });
		const isRight = response.isRight();
		if (isRight) {
			const data = response.value;
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
