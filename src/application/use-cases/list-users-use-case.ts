import { JSON, User } from '@/domain/entities/user.js';
import { right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { UseCase, Output } from '@/shared/core/use-cases/use-case.js';
import { Optional } from '@/shared/types/optional.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';

export interface Input {
	orderBy?: string;
	ordem?: string;
	page?: number;
}

export type Right = { pages: number; users: Array<Optional<JSON, 'password'>> };

export class ListUsersUseCase extends UseCase<Right, Input> {
	constructor(
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output<Right> {
		const ordem = input.ordem === 'ASC' || input.ordem === 'DESC' ? input.ordem : 'DESC';
		const options: Record<string, keyof User> = {
			id: 'id',
			name: 'name',
			email: 'email',
			created_at: 'createdAt',
			updated_at: 'updatedAt',
		};
		if (!input.orderBy) input.orderBy = 'createdAt';
		const orderBy = options[input.orderBy] ?? 'createdAt';
		const page = input.page ?? 1;
		const response = await this.usersRepository.list({ ordem, orderBy, page });
		const users = response.data.map(user => ({ ...user.toJSON(), password: undefined }));
		const pages = response.pages;
		return right({ users, pages });
	}
}
