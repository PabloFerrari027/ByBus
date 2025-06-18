import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';
import { ListUsersUseCase } from '@/application/use-cases/list-users-use-case.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { ListUsersMapper } from '../mappers/list-users-mapper.js';

export class ListUsersController extends Controller {
	constructor(
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const query = input.query;
		const useCase = new ListUsersUseCase(this.usersRepository, this.loggerProvider);
		const response = await useCase.handle(ListUsersMapper.fromRequest(input.query));
		const isRight = response.isRight();
		delete query.page;
		delete query.order_by;
		delete query.ordem;
		let fields = { ...query, id: true };
		if (Object.keys(fields).length === 1) fields = {};
		if (isRight) {
			const data = ListUsersMapper.toResponse(response.value);
			const filtered = data.users.map((user: any) => UserPresenter.format(user, fields));
			return { status: 200, data: filtered };
		} else {
			throw response.value;
		}
	}
}
