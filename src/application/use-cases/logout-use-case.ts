import { Output, UseCase } from '@/shared/core/use-cases/use-case.js';
import { left, right } from '@/shared/types/either.js';
import { SessionsRepository } from '../ports/repositories/sessions-repository.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { NotFound } from '@/domain/errors/not-found.js';

interface Input {
	sessionId: string;
}

export class LogoutUseCase extends UseCase<void, Input> {
	constructor(
		private readonly sessionsRepository: SessionsRepository,
		loggerProvider: LoggerProvider,
	) {
		super(loggerProvider);
	}

	async execute(input: Input): Output<void> {
		const session = await this.sessionsRepository.findById(input.sessionId);

		if (!session) {
			const title = 'User not found';
			const message = `Session with ID ${input.sessionId} is not found`;
			const error = new NotFound(title, message);
			return left(error);
		}

		session.close();

		await this.sessionsRepository.save(session);
		return right(undefined);
	}
}
