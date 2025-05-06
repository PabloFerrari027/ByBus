import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { JSON, User } from '@/domain/entities/user.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { EventBus } from '@/infraestructure/event-bus/event-bus.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { UseCase, Output } from '@/shared/core/use-cases/use-case.js';
import { Optional } from '@/shared/types/optional.js';
import { Password } from '@/domain/value-objects/Password.js';
import { Name } from '@/domain/value-objects/Name.js';
import { Email } from '@/domain/value-objects/Email.js';
import { NotFound } from '@/domain/errors/not-found.js';

export interface Input {
	userId: string;
	newPassword: string;
}

export type Right = { user: Optional<JSON, 'password'> };

export class ResetPasswordUseCase extends UseCase<Right> {
	private user: User | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly loggerProvider: LoggerProvider,
	) {
		super();
		this.user = null;
	}

	async execute(input: Input): Output<Right> {
		Password.validate(input.newPassword);

		this.user = await this.usersRepository.findById(input.userId);

		if (!this.user) {
			const title = 'User not found';
			const message = `User with ID ${input.userId} is not found`;
			const error = new NotFound(title, message);
			return left(error);
		}

		const oldPassword = this.user.password.value;

		this.user.changePassword = input.newPassword;

		const newPassword = this.user.password.value;

		this.user = await this.usersRepository.create(this.user);

		await this.loggerProvider.info('User password update', {
			userId: this.user.id.value,
			oldPassword,
			newPassword,
		});

		const events = this.user.pullEvents();

		await Promise.all(events.map(async event => await EventBus.publish(event)));

		return right({ user: { ...this.user.toJSON(), password: undefined } });
	}
}
