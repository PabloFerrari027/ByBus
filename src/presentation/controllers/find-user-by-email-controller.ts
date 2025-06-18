import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { FindUserByEmailUseCase } from '@/application/use-cases/find-user-by-email-use-case.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { FindUserByEmailMapper } from '../mappers/find-user-by-email-mapper.js';

export class FindUserByEmailController extends Controller {
	constructor(
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const query = input.query;
		const useCase = new FindUserByEmailUseCase(this.usersRepository, this.loggerProvider);
		const response = await useCase.handle(FindUserByEmailMapper.fromRequest(input.query));
		const isRight = response.isRight();
		let fields = { ...query, email: true };
		if (Object.keys(fields).length === 1) fields = {};
		if (isRight) {
			const data = FindUserByEmailMapper.toResponse(response.value.user);
			const filtered = UserPresenter.format(data, fields);
			return { status: 200, data: filtered };
		} else {
			throw response.value;
		}
	}
}
