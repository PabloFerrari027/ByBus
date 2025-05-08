import { Session } from '@/domain/entities/session.js';
import { Output, UseCase } from '@/shared/core/use-cases/use-case.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { InternalServerError } from '@/domain/errors/internal-server-error.js';
import { SessionProvider } from '../ports/providers/session-provider.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { Name } from '@/domain/value-objects/name.js';
import { Email } from '@/domain/value-objects/email.js';
import { Password } from '@/domain/value-objects/password.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { EventBus } from '@/infraestructure/event-bus/event-bus.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { User, AuthProvider as IAuthProvider } from '@/domain/entities/user.js';
import { AuthStrategy } from '../strategies/auth-strategy.js';

interface Right {
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
		private readonly sessionProvider: SessionProvider,
		private readonly authStrategies: AuthStrategy[],
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
		this.session = null;
	}

	async execute(input: Input): Output<Right> {
		const authProvider = input.authProvider.toUpperCase() as IAuthProvider;
		const authStrategy = this.authStrategies.find(s => s.canHandle(authProvider));

		if (!authStrategy) {
			const title = 'Invalid Credentials';
			const message =
				'The credentials provided are incorrect. Please check your credentials and try again.';
			const error = new NotAccptable(title, message);
			return left(error);
		}

		this.user = await this.usersRepository.findByEmail(input.email);

		if (!this.user) {
			this.user = User.create({
				id: UUID.create().value,
				name: input.name,
				email: input.email,
				password: input.password ?? null,
				sessionId: UUID.create().value,
				authProvider,
			});

			await authStrategy.authenticate({
				user: this.user,
				credentials: {
					email: input.email,
					method: authProvider,
					name: input.name,
					password: input.password ?? '',
					authToken: input.authToken ?? '',
				},
			});

			this.session = await this.sessionProvider.create(this.user.id, this.user.sessionId);

			this.user = await this.usersRepository.create(this.user);
			await EventBus.publish(new CreatedUserEvent({ userId: this.user.id }));
			this.loggerProvider.info({ message: 'User created', meta: { userId: this.user.id } });
		} else {
			await authStrategy.authenticate({
				user: this.user,
				credentials: {
					email: input.email,
					method: authProvider,
					name: input.name,
					password: input.password ?? '',
					authToken: input.authToken ?? '',
				},
			});

			this.session = await this.sessionProvider.findById(this.user.sessionId);
		}

		if (!this.session) {
			const title = 'Session Not Found';
			const message = `User session with ID ${this.user.id.value} not found when trying to login`;
			const error = new InternalServerError(title, message);
			return left(error);
		}

		this.session = await this.sessionProvider.revalidate(this.session);
		this.loggerProvider.info({ message: 'User login', meta: { userId: this.user.id } });

		return right({ session: this.session, user: this.user });
	}
}
