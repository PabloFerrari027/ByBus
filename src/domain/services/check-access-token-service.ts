import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { Unauthorized } from '../errors/unauthorized.js';
import { Either, left, right } from '@/shared/types/either.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { UUID } from '../value-objects/uuid.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';

interface Input {
	accessToken: string;
}

type Output = Promise<Either<Unauthorized, void>>;
interface TokenData {
	userId: UUID;
	sessionId: UUID;
}

export class CheckAccessTokenService {
	constructor(
		private readonly tokenStrategy: TokenStrategy,
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
	) {}

	async execute(input: Input): Output {
		const token = await this.tokenStrategy.decode<TokenData>(input.accessToken);
		const isExpired = token.isExpired;

		if (isExpired) return left(new Unauthorized());

		const user = await this.usersRepository.findById(token.data.userId.value);

		if (!user) return left(new Unauthorized());

		if (!user.emailVerified) return left(new Unauthorized());

		const session = await this.sessionsRepository.findById(token.data.sessionId.value);

		if (!session) return left(new Unauthorized());

		if (session.isClosed()) return left(new Unauthorized());

		return right(undefined);
	}
}
