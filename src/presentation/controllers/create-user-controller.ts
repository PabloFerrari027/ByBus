import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { CreateUserUseCase } from '@/application/use-cases/create-user-use-case.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';

interface Body {
	name: string;
	email: string;
	password: string;
}

export class CreateUserController extends Controller {
	constructor(private readonly usersRepository: UsersRepository) {
		super();
	}

	async execute(input: Input): Output {
		const body = input.body as unknown as Body;
		const name = body.name;
		const email = body.email;
		const password = body.password;
		const query = input.query as Record<string, boolean>;
		const useCase = new CreateUserUseCase(this.usersRepository);
		const response = await useCase.execute({ email, name, password });
		const isRight = response.isRight();
		if (isRight) {
			const data = UserPresenter.format(response.value.user, query);
			return { status: 201, data };
		} else {
			throw response.value;
		}
	}
}
