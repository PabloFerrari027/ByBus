import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { Controller, Input, Output } from '@/shared/core/http/controller.js';
import { ValidateAccountUseCase } from '@/application/use-cases/validate-account-use-case.js';
import { UserVerificationCodeRepository } from '@/application/ports/repositories/user-verification-code-repository.js';

interface Body {
	code: number;
	user_id: string;
}

export class ValidateAccountController extends Controller {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output {
		const body = input.body as unknown as Body;
		const code = body.code;
		const userId = body.user_id;
		const useCase = new ValidateAccountUseCase(
			this.usersRepository,
			this.userVerificationCodeRepository,
			this.loggerProvider,
		);
		const response = await useCase.hanlde({ code, userId });
		const isRight = response.isRight();
		if (isRight) return { status: 200, data: null };
		else throw response.value;
	}
}
