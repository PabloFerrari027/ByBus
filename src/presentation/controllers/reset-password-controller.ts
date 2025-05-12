import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { UserPresenter } from '../presenters/user-presenter.js';
import { ResetPasswordUseCase } from '@/application/use-cases/reset-password-use-case.js';

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
		const body = input.body as unknown as Body;
		const userId = body.user_id;
		const newPassword = body.new_password;
		const query = input.query as Record<string, boolean>;
		const useCase = new ResetPasswordUseCase(this.usersRepository, this.loggerProvider);
		const response = await useCase.hanlde({ userId, newPassword });
		const isRight = response.isRight();
		if (isRight) {
			const data = UserPresenter.format(response.value.user, query);
			return { status: 200, data };
		} else {
			throw response.value;
		}
	}
}
