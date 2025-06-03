import { Session } from '@/domain/entities/session.js';
import { Either, left, right } from '@/shared/types/either.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { User } from '@/domain/entities/user.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { NotFound } from '../errors/not-found.js';

interface Right {
	session: Session;
}

type Left = NotFound;

type Output = Promise<Either<Left, Right>>;

interface Input {
	user: User;
}

export class CreateSessionService {
	private session: Session | null;

	constructor(
		private readonly sessionsRepository: SessionsRepository,
		private readonly tokenStrategy: TokenStrategy,
	) {
		this.session = null;
	}

	async execute(input: Input): Output {
		const sessionId = UUID.create();

		const refreshToken = await this.tokenStrategy.create({
			sessionId,
			userId: input.user.id,
		});

		this.session = Session.create({
			id: sessionId,
			refreshToken,
			userId: input.user.id,
			closedAt: null,
		});

		await this.sessionsRepository.create(this.session);

		return right({ session: this.session });
	}
}
