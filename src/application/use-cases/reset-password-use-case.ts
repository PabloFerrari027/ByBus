import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UserJSON, User } from '@/domain/entities/user.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { UseCase, Output } from '@/shared/core/use-cases/use-case.js';
import { Optional } from '@/shared/types/optional.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { NotAllowed } from '@/domain/errors/not-allowed.js';

export interface Input {
	userId: string;
	newPassword: string;
}

export type Right = { user: Optional<UserJSON, 'password'> };

export class ResetPasswordUseCase extends UseCase<Right, Input> {
	private user: User | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
	}

	async execute(input: Input): Output<Right> {
		this.user = await this.usersRepository.findById(input.userId);

		if (!this.user) {
			const title = 'User not found';
			const message = `User with ID ${input.userId} is not found`;
			const error = new NotFound(title, message);
			return left(error);
		}

		if (this.user.authProvider !== 'CREDENTIALS') {
			const title = 'Operation Not Allowed';
			const message =
				'password update is not allowed for users authenticated via third-party providers. This action is only suported for accounts using credentials.';
			const error = new NotAllowed(title, message);
			return left(error);
		}

		await this.user.changePassword(input.newPassword);
		this.user = await this.usersRepository.save(this.user);

		await this.loggerProvider.info({
			message: 'User password update',
			meta: { userId: this.user.id },
		});

		return right({ user: { ...this.user.toJSON(), password: undefined } });
	}
}
