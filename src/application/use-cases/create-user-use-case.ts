import { SessionProvider } from '@/application/ports/providers/session-provider.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { JSON as UserJSON, User } from '@/domain/entities/user.js';
import { right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { EventBus } from '@/infraestructure/event-bus/event-bus.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { UseCase, Output } from '@/shared/core/use-cases/use-case.js';
import { Optional } from '@/shared/types/optional.js';
import { Password } from '@/domain/value-objects/password.js';
import { Name } from '@/domain/value-objects/name.js';
import { Email } from '@/domain/value-objects/email.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { Session, JSON as SessionJSON } from '@/domain/entities/session.js';

export interface Input {
	name: string;
	email: string;
	password: string;
}

export type Right = { user: Optional<UserJSON, 'password'>; session: SessionJSON };

export class CreateUserUseCase extends UseCase<Right, Input> {
	private user: User | null;
	private session: Session | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionProvider: SessionProvider,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
		this.session = null;
	}

	async execute(input: Input): Output<Right> {
		Name.validate(input.name);
		Email.validate(input.email);
		Password.validate(input.password);

		const alreadyExists = await this.usersRepository.findByEmail(input.email);

		if (alreadyExists) {
			const title = 'User already exists';
			const message = `User with email ${input.email} already exists`;
			throw new AlreadyExists(title, message);
		}

		const userId = UUID.create();

		this.session = await this.sessionProvider.create(userId.value);

		this.user = User.create({
			id: userId.value,
			name: input.name,
			email: input.email,
			password: input.password,
			sessionId: this.session.id,
		});

		this.user = await this.usersRepository.create(this.user);

		await this.loggerProvider.info('User created', { userId: this.user.id.value });

		await EventBus.publish(new CreatedUserEvent({ userId: this.user.id }));

		return right({
			user: { ...this.user.toJSON(), password: undefined },
			session: this.session.toJSON(),
		});
	}
}
