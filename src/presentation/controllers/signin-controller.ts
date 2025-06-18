import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { SigninUseCase } from '@/application/use-cases/sigin-use-case.js';
import { SignInMapper } from '../mappers/signin-mapper.js';

interface Body {
	name: string;
	email: string;
	auth_provider: string;
	password?: string;
	auth_token?: string;
}

export class SigninController extends Controller {
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
		const useCase = new SigninUseCase(
			this.usersRepository,
			this.sessionsRepository,
			this.tokenStrategy,
			this.authStrategies,
			this.loggerProvider,
		);
		const response = await useCase.handle(SignInMapper.fromRequest(body));
		const isRight = response.isRight();
		if (isRight) {
			const data = SignInMapper.toResponse(response.value);
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
