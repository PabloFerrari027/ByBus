import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { FindUserByEmailUseCase } from '@/application/use-cases/find-user-by-email-use-case.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';

export class FindUserByEmailController extends Controller {
	constructor(private readonly usersRepository: UsersRepository) {
		super();
	}

	async execute(input: Input): Output {
		const query = input.query;
		const email = query.email;
		const useCase = new FindUserByEmailUseCase(this.usersRepository);
		const response = await useCase.execute({ email });
		const isRight = response.isRight();
		let fields = { ...query, email: true };
		if (Object.keys(fields).length === 1) fields = {};
		if (isRight) {
			const data = UserPresenter.format(response.value.user, fields);
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
