import { Text } from '@/domain/value-objects/Text.js';
import { User } from '@/domain/entities/user.js';
import { left, right } from '@/shared/types/either.js';
import { CreateUser as ICreateUser, Input, Output } from '../ports/use-cases/create-user.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { EventBus } from '@/infraestructure/event-bus/event-bus.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';

export class CreateUser extends ICreateUser {
	private user: User | null;

	constructor(private readonly usersRepository: UsersRepository) {
		super();
		this.user = null;
	}

	async execute(input: Input): Output {
		const isNameEmpty = Text.isEmpty(input.name);

		if (isNameEmpty) {
			const title = 'Name is empty';
			const message = 'Name is required';
			return left(new NotAccptable(title, message));
		}

		const isEmailEmpty = Text.isEmpty(input.email);

		if (isEmailEmpty) {
			const title = 'Email is empty';
			const message = 'Email is required';
			return left(new NotAccptable(title, message));
		}

		const isPasswordEmpty = Text.isEmpty(input.password);

		if (isPasswordEmpty) {
			const title = 'Password is empty';
			const message = 'Password is required';
			return left(new NotAccptable(title, message));
		}

		const alreadyExists = await this.usersRepository.findByEmail(input.email);

		if (alreadyExists) {
			const title = 'User already exists';
			const message = `User with email ${input.email} already exists`;
			return left(new AlreadyExists(title, message));
		}

		this.user = User.create({
			name: input.name,
			email: input.email,
			password: input.password,
		});

		this.user = await this.usersRepository.create(this.user);

		await EventBus.publish(CreatedUserEvent.name, new CreatedUserEvent({ userId: this.user.id }));

		return right(null);
	}
}
