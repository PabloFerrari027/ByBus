import { TokenData } from '@/application/ports/providers/session-provider.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { Output, Service } from '@/shared/core/services/service.js';
import { Unauthorized } from '../errors/unauthorized.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';

interface Input {
	accessToken: string;
}

export class CheckAccessToken extends Service<void, Input> {
	constructor(
		private readonly tokenStrategy: TokenStrategy<TokenData>,
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output<void> {
		const token = await this.tokenStrategy.decode(input.accessToken);
		const isExpired = token.isExpired;
		if (isExpired) {
			const error = new Unauthorized();
			return left(error);
		}
		const user = await this.usersRepository.findById(token.data.userId.value);
		if (!user) {
			const error = new Unauthorized();
			return left(error);
		}
		if (!user.sessionId.compare(token.data.sessionId)) {
			const error = new Unauthorized();
			return left(error);
		}
		return right(undefined);
	}
}
