import { Session } from '@/domain/entities/session.js';
import { Output, UseCase } from '@/shared/core/use-cases/use-case.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { SessionsRepository } from '../ports/repositories/sessions-repository.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { User } from '@/domain/entities/user.js';
import { TokenStrategy } from '../strategies/token-strategy.js';
import { left, right } from '@/shared/types/either.js';
import { Unauthorized } from '@/domain/errors/unauthorized.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { Token } from '@/domain/entities/token.js';

interface Right {
	accessToken: Token<{ userId: UUID; sessionId: UUID }>;
	refreshToken: Token<{ userId: UUID; sessionId: UUID }>;
}

interface Input {
	accessToken: string;
	refreshToken: string;
}

interface TokenData {
	userId: UUID;
	sessionId: UUID;
}

export class RefreshTokenUseCase extends UseCase<Right, Input> {
	private user: User | null;
	private session: Session | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
		private readonly tokenStrategy: TokenStrategy,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
		this.session = null;
	}

	async execute(input: Input): Output<Right> {
		const accessToken = await this.tokenStrategy.decode<TokenData>(input.accessToken);
		const userId = accessToken.data.userId;
		const sessionId = accessToken.data.sessionId;

		this.user = await this.usersRepository.findById(userId.value);

		if (!this.user) return left(new Unauthorized());

		this.session = await this.sessionsRepository.findById(sessionId.value);

		if (!this.session) return left(new Unauthorized());

		const isSameRefreshToken = this.session.refreshToken.compare(input.refreshToken);
		if (!isSameRefreshToken) return left(new Unauthorized());

		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 1);
		const newAccessToken = await this.tokenStrategy.create(
			{ userId: this.user.id, sessionId: this.session.id },
			expiresAt,
		);

		return right({ refreshToken: this.session.refreshToken, accessToken: newAccessToken });
	}
}
