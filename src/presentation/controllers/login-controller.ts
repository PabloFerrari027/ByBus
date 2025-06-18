import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { LoginUseCase } from '@/application/use-cases/login-use-case.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { LoginMapper } from '../mappers/login-mapper.js';

interface Body {
	name: string;
	email: string;
	auth_provider: string;
	password?: string;
	auth_token?: string;
}

export class LoginController extends Controller {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
		private readonly authStrategies: AuthStrategy[],
		private readonly tokenStrategy: TokenStrategy,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const body = input.body as unknown as Body;
		const useCase = new LoginUseCase(
			this.usersRepository,
			this.sessionsRepository,
			this.tokenStrategy,
			this.authStrategies,
			this.loggerProvider,
		);
		const response = await useCase.handle(LoginMapper.fromRequest(body));
		const isRight = response.isRight();
		if (isRight) {
			const data = LoginMapper.toResponse(response.value);
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
