import { Session } from '@/domain/entities/session.js';
import { User } from '@/domain/entities/user.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { Output, UseCase } from '@/shared/core/use-cases/use-case.js';
import { left, right } from '@/shared/types/either.js';
import { UsersRepository } from '../ports/repositories/users-repository.js';
import { InternalServerError } from '@/domain/errors/internal-server-error.js';
import { SessionProvider } from '../ports/providers/session-provider.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';

interface Right {
	session: Session;
}

interface Input {
	email: string;
	password: string;
}

export class LoginUseCase extends UseCase<Right, Input> {
	private user: User | null;
	private session: Session | null;

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly sessionProvider: SessionProvider,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
		this.user = null;
		this.session = null;
	}

	async execute(input: Input): Output<Right> {
		this.user = await this.usersRepository.findByEmail(input.email);

		if (!this.user) {
			const title = 'User not found';
			const message = `User with email ${input.email} is not found`;
			const error = new NotFound(title, message);
			return left(error);
		}

		const isSamePass = await this.user.password.compare(input.password);

		if (!isSamePass) {
			const title = 'Invalid credentials';
			const message =
				'The email or password you provided is incorrect. Please check your credentials and try again.';
			const error = new NotAccptable(title, message);
			return left(error);
		}

		this.session = await this.sessionProvider.findById(this.user.sessionId.value);

		if (!this.session) {
			const title = 'Session not found';
			const message = `User session with ID ${this.user.id.value} not found when trying to login`;
			const error = new InternalServerError(title, message);
			return left(error);
		}

		this.session = await this.sessionProvider.revalidate(this.session);

		this.loggerProvider.info('User login', { userId: this.user.id.value });

		return right({ session: this.session });
	}
}
