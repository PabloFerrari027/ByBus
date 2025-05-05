import { JSON, User } from '@/domain/entities/user.js';
import { Either, left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { UseCase } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { Optional } from '@/shared/types/optional.js';

export interface Input {
	email: string;
}
export type Left = NotFound | null;
export type Right = { user: Optional<JSON, 'password'> };
export type Output = Promise<Either<Left, Right>>;

export class FindUserByEmailUseCase extends UseCase<Input, Output> {
	private user: User | null;

	constructor(private readonly usersRepository: UsersRepository) {
		super();
		this.user = null;
	}

	async execute(input: Input): Output {
		this.user = await this.usersRepository.findByEmail(input.email);

		if (!this.user) {
			const title = 'User not found';
			const message = `User with email ${input.email} is not found`;
			const error = new NotFound(title, message);
			return left(error);
		}

		return right({ user: { ...this.user.toJSON(), password: undefined } });
	}
}
