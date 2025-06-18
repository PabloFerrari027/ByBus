import { Output, UseCase } from '@/shared/core/use-cases/use-case.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { User, UserRole } from '@/domain/entities/user.js';
import { NotFound } from '@/domain/errors/not-found.js';

interface Right {
	user: User;
}

interface Input {
	userId: string;
	role: string;
}

export class UpdateUserRoleUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output<Right> {
		User.validateRole(input.role);

		const user = await this.usersRepository.findById(input.userId);

		if (!user) {
			const errorTitle = 'User Not Found';
			const errorMessage = 'The requested user was not found.';
			return left(new NotFound(errorTitle, errorMessage));
		}

		user.changeRole(input.role as UserRole);

		await this.usersRepository.save(user);

		return right({ user });
	}
}
