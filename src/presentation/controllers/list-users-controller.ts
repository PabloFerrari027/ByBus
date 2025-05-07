import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';
import { ListUsersUseCase } from '@/application/use-cases/list-users-use-case.js';

export class ListUsersController extends Controller {
	constructor(private readonly usersRepository: UsersRepository) {
		super();
	}

	async execute(input: Input): Output {
		const query = input.query;
		const page = input.query.page;
		const orderBy = input.query.order_by;
		const ordem = input.query.ordem;
		const useCase = new ListUsersUseCase(this.usersRepository);
		const response = await useCase.hanlde({ ordem, orderBy, page });
		const isRight = response.isRight();
		delete query.page;
		delete query.order_by;
		delete query.ordem;
		let fields = { ...query, id: true };
		if (Object.keys(fields).length === 1) fields = {};
		if (isRight) {
			const users = response.value.users.map(user => UserPresenter.format(user, fields));
			const pages = response.value.pages;
			const data = { users, pages };
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
