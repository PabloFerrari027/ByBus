import { JSON, User } from '@/domain/entities/user.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { UseCase, Output } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { Optional } from '@/shared/types/optional.js';

export interface Input {
	id: string;
}
export type Right = { user: Optional<JSON, 'password'> };

export class FindUserByIdUseCase extends UseCase<Right> {
	private user: User | null;

	constructor(private readonly usersRepository: UsersRepository) {
		super();
		this.user = null;
	}

	async execute(input: Input): Output<Right> {
		this.user = await this.usersRepository.findById(input.id);

		if (!this.user) {
			const title = 'User not found';
			const message = `User with ID ${input.id} is not found`;
			const error = new NotFound(title, message);
			return left(error);
		}

		return right({ user: { ...this.user.toJSON(), password: undefined } });
	}
}
