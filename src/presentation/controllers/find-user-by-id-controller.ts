import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { FindUserByIdUseCase } from '@/application/use-cases/find-user-by-id-use-case.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';

export class FindUserByIdController extends Controller {
	constructor(private readonly usersRepository: UsersRepository) {
		super();
	}

	async execute(input: Input): Output {
		const query = input.query;
		const id = input.query.id;
		const useCase = new FindUserByIdUseCase(this.usersRepository);
		const response = await useCase.hanlde({ id });
		const isRight = response.isRight();
		let fields = { ...query, id: true };
		if (Object.keys(fields).length === 1) fields = {};
		if (isRight) {
			const data = UserPresenter.format(response.value.user, fields);
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
