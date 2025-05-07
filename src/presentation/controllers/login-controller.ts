import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { SessionProvider } from '@/application/ports/providers/session-provider.js';
import { LoginUseCase } from '@/application/use-cases/login-use-case.js';

interface Body {
	name: string;
	email: string;
	password: string;
}

export class LoginController extends Controller {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionProvider: SessionProvider,
		private readonly loggerProvider: LoggerProvider,
	) {
		super();
	}

	async execute(input: Input): Output {
		const body = input.body as unknown as Body;
		const email = body.email;
		const password = body.password;
		const useCase = new LoginUseCase(
			this.usersRepository,
			this.sessionProvider,
			this.loggerProvider,
		);
		const response = await useCase.hanlde({ email, password });
		const isRight = response.isRight();
		if (isRight) {
			const data = {
				access_token: response.value.session.accessToken.value,
				refresh_token: response.value.session.refreshToken.value,
			};
			return { status: 201, data };
		} else {
			throw response.value;
		}
	}
}
