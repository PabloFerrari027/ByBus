import { UserJSON, User } from '@/domain/entities/user.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { Output, UseCase } from '@/shared/core/use-cases/use-case.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { Optional } from '@/shared/types/optional.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';

export interface Input {
	email: string;
}
export type Right = { user: Optional<UserJSON, 'password'> };

export class FindUserByEmailUseCase extends UseCase<Right, Input> {
	private user: User | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
	}

	async execute(input: Input): Output<Right> {
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
