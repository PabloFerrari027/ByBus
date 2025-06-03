import { Output, UseCase } from '@/shared/core/use-cases/use-case.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { User } from '@/domain/entities/user.js';
import { NotAcceptable } from '@/domain/errors/not-accptable.js';
import { EventBus } from '@/infraestructure/event-bus/event-bus.js';
import { UserVerificationCodeRepository } from '../ports/repositories/user-verification-code-repository.js';

interface Input {
	code: number;
	userId: string;
}

type Right = void;

export class ValidateAccountUseCase extends UseCase<Right, Input> {
	private user: User | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
	}

	async execute(input: Input): Output<Right> {
		const userVerificationCode = await this.userVerificationCodeRepository.find(
			input.code,
			input.userId,
		);

		if (!userVerificationCode) {
			const title = 'Invalid Code';
			const message = `The authentication code provided is invalid.`;
			const error = new NotAcceptable(title, message);
			return left(error);
		}

		const isExpired = userVerificationCode.isExpired;

		if (isExpired) {
			const title = 'Code Expired';
			const message =
				'Your authentication code has expired. Please log in again to obtain a new code.';
			return left(new NotAcceptable(title, message));
		}

		this.user = await this.usersRepository.findById(input.userId);

		if (!this.user) {
			const title = 'Invalid Code';
			const message = `The authentication code provided is invalid.`;
			const error = new NotAcceptable(title, message);
			return left(error);
		}

		this.user.verifiedAccount();
		userVerificationCode.used();

		await this.usersRepository.save(this.user);
		await this.userVerificationCodeRepository.save(userVerificationCode);

		this.loggerProvider.info({ message: 'Verified User', meta: { userId: this.user.id } });
		this.user.pullEvents().map(event => EventBus.publish(event));
		return right(undefined);
	}
}
