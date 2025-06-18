import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';
import { ResetPasswordUseCase } from '@/application/use-cases/reset-password-use-case.js';
import { ResetPasswordMapper } from '../mappers/reset-password-mapper.js';

interface Body {
	user_id: string;
	new_password: string;
}

export class ResetPasswordController extends Controller {
	constructor(
		private readonly usersRepository: UsersRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const body = input.body as Body;
		const query = input.query as Record<string, boolean>;
		const useCase = new ResetPasswordUseCase(this.usersRepository, this.loggerProvider);
		const response = await useCase.handle(ResetPasswordMapper.fromRequest(body));
		const isRight = response.isRight();
		if (isRight) {
			const data = ResetPasswordMapper.toResponse(response.value.user);
			const filtered = UserPresenter.format(data, query);
			return { status: 200, data: filtered };
		} else {
			throw response.value;
		}
	}
}
