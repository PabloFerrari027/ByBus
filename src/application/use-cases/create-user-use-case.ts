import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { JSON, User } from '@/domain/entities/user.js';
import { right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { EventBus } from '@/infraestructure/event-bus/event-bus.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { UseCase, Output } from '@/shared/core/use-cases/use-case.js';
import { Optional } from '@/shared/types/optional.js';
import { Password } from '@/domain/value-objects/Password.js';
import { Name } from '@/domain/value-objects/Name.js';
import { Email } from '@/domain/value-objects/Email.js';

export interface Input {
	name: string;
	email: string;
	password: string;
}

export type Right = { user: Optional<JSON, 'password'> };

export class CreateUserUseCase extends UseCase<Right, Input> {
	private user: User | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly loggerProvider: LoggerProvider,
	) {
		super();
		this.user = null;
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

		this.user = User.create({
			name: input.name,
			email: input.email,
			password: input.password,
		});

		this.user = await this.usersRepository.create(this.user);

		await this.loggerProvider.info('User created', { userId: this.user.id.value });

		await EventBus.publish(new CreatedUserEvent({ userId: this.user.id }));

		return right({ user: { ...this.user.toJSON(), password: undefined } });
	}
}
