import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { TokenData } from '@/application/ports/providers/session-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { Unauthorized } from '@/domain/errors/unauthorized.js';
import { CheckAccessToken } from '@/domain/services/check-access-token.js';
import { Middleware, Input, Output } from '@/shared/core/http/middleware.js';

export class ValidateSession extends Middleware {
	constructor(
		private readonly tokenStrategy: TokenStrategy<TokenData>,
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const headers = input.headers;
		const accessToken = headers?.authorization as string;

		if (!accessToken) {
			const { message, title } = new Unauthorized();
			const errors = [{ title, message }];
			return {
				next: false,
				status: 401,
				data: { errors },
			};
		}
		const checkAccessToken = new CheckAccessToken(
			this.tokenStrategy,
			this.usersRepository,
			this.loggerProvider,
		);
		const response = await checkAccessToken.execute({ accessToken });
		console.log(response.value);

		if (response.isLeft()) throw response.value;
		else return { next: true, status: 200 };
	}
}
