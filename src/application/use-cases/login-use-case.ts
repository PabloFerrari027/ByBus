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
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { EventBus } from '@/infraestructure/event-bus/event-bus.js';
import { LoginEvent } from '@/domain/events/login-event.js';
import { Token } from '@/domain/entities/token.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';

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

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
		private readonly tokenStrategy: TokenStrategy,
		private readonly authStrategies: AuthStrategy[],
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
	}

	async execute(input: Input): Output<Right> {
		const authProvider = input.authProvider.toUpperCase() as AuthProvider;
		const authStrategy = this.authStrategies.find(s => s.canHandle(authProvider));

		if (!authStrategy) {
			const title = 'Invalid Credentials';
			const message =
				'The credentials provided are incorrect. Please check your credentials and try again.';
			const error = new NotAccptable(title, message);
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
			this.user = await this.usersRepository.create(
				User.create({
					id: UUID.generate(),
					authProvider,
					email: input.email,
					emailVerified: authProvider !== 'CREDENTIALS',
					name: input.name,
					password: input.password,
				}),
			);
			EventBus.publish(new CreatedUserEvent({ userId: this.user.id }));
			await this.loggerProvider.info({ message: 'User created', meta: { userId: this.user.id } });
		}

		const sessionId = UUID.create();

		const refreshToken = await this.tokenStrategy.create({
			sessionId,
			userId: this.user.id,
		});

		const session = Session.create({
			id: sessionId,
			refreshToken,
			userId: this.user.id,
			closedAt: null,
		});

		await this.sessionsRepository.create(session);
		EventBus.publish(new LoginEvent({ userId: this.user.id }));
		this.loggerProvider.info({ message: 'Login', meta: { userId: this.user.id } });

		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 1);
		const accessToken = await this.tokenStrategy.create(
			{ userId: this.user.id, sessionId: session.id },
			expiresAt,
		);

		return right({ session, user: this.user, accessToken });
	}
}
