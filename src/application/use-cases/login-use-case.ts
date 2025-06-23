import { Session } from '@/domain/entities/session.js';
import { Output, UseCase } from '@/shared/core/use-cases/use-case.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { SessionsRepository } from '../ports/repositories/sessions-repository.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { User, AuthProvider } from '@/domain/entities/user.js';
import { AuthStrategy } from '../strategies/auth-strategy.js';
import { TokenStrategy } from '../strategies/token-strategy.js';
import { NotAcceptable } from '@/domain/errors/not-acceptable.js';
import { Token } from '@/domain/entities/token.js';
import { CreateSessionService } from '@/domain/services/create-session-service.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { DomainEvents } from '@/infraestructure/event-bus/domain-events.js';
import { CreatedSessionEvent } from '@/domain/events/created-session-event.js';

interface Right {
	accessToken: Token<{ userId: UUID; sessionId: UUID }>;
	session: Session;
	user: User;
}

interface Input {
	email: string;
	authProvider: string;
	name: string;
	password?: string;
	authToken?: string;
}

export class LoginUseCase extends UseCase<Right, Input> {
	private user: User | null;
	private session: Session | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
		private readonly tokenStrategy: TokenStrategy,
		private readonly authStrategies: AuthStrategy[],
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
		this.session = null;
	}

	async execute(input: Input): Output<Right> {
		const authProvider = input.authProvider.toUpperCase() as AuthProvider;
		const authStrategy = this.authStrategies.find(s => s.canHandle(authProvider));

		if (!authStrategy) {
			const title = 'Invalid Credentials';
			const message =
				'The credentials provided are incorrect. Please check your credentials and try again.';
			const error = new NotAcceptable(title, message);
			return left(error);
		}

		await authStrategy.authenticate({
			email: input.email,
			method: authProvider,
			name: input.name,
			password: input.password ?? '',
			authToken: input.authToken ?? '',
		});

		this.user = await this.usersRepository.findByEmail(input.email);

		if (!this.user) {
			const title = 'User Not Found';
			const message = 'No user was found with the provided user ID.';
			return left(new NotFound(title, message));
		}

		const createSessionService = new CreateSessionService(
			this.sessionsRepository,
			this.tokenStrategy,
		);

		const response = await createSessionService.execute({ user: this.user });

		if (response.isLeft()) return left(response.value);

		this.session = response.value.session;
		await this.loggerProvider.info({
			message: 'Session Created',
			meta: { userId: this.user.id.value, sessionId: this.session.id.value },
		});

		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 1);

		const accessToken = await this.tokenStrategy.create(
			{ userId: this.user.id, sessionId: this.session.id },
			expiresAt,
		);

		await DomainEvents.dispatch([new CreatedSessionEvent(this.user.id, this.session.id)]);

		return right({ session: this.session, user: this.user, accessToken });
	}
}
