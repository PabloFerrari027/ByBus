import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { FindUserByIdUseCase } from '@/application/use-cases/find-user-by-id-use-case.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { FindUserByIdMapper } from '../mappers/find-user-by-id-mapper.js';

export class FindUserByIdController extends Controller {
	constructor(
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const query = input.query;
		const useCase = new FindUserByIdUseCase(this.usersRepository, this.loggerProvider);
		const response = await useCase.handle(FindUserByIdMapper.fromRequest(input.query));
		const isRight = response.isRight();
		let fields = { ...query, id: true };
		if (Object.keys(fields).length === 1) fields = {};
		if (isRight) {
			const data = FindUserByIdMapper.toResponse(response.value.user);
			const filtered = UserPresenter.format(data, fields);
			return { status: 200, data: filtered };
		} else {
			throw response.value;
		}
	}
}
