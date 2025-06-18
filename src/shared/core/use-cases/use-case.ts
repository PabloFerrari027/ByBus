import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { InternalServerError } from '@/domain/errors/internal-server-error.js';
import { NotAcceptable } from '@/domain/errors/not-acceptable.js';
import { NotAllowed } from '@/domain/errors/not-allowed.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { Unauthorized } from '@/domain/errors/unauthorized.js';
import { Either, left } from '@/shared/types/either.js';

export type Left = InternalServerError | NotFound | NotAcceptable | AlreadyExists;
export type Output<Right> = Promise<Either<Left, Right>>;

export abstract class UseCase<Right, Input> {
	constructor(protected readonly loggerProvider: LoggerProvider) {}
	protected abstract execute(input: Input): Output<Right>;
	public async handle(input: Input): Output<Right> {
		try {
			return await this.execute(input);
		} catch (error) {
			if (error instanceof NotFound) return left(error);
			if (error instanceof NotAcceptable) return left(error);
			if (error instanceof AlreadyExists) return left(error);
			if (error instanceof InternalServerError) return left(error);
			if (error instanceof NotAllowed) return left(error);
			if (error instanceof Unauthorized) return left(error);
			await this.loggerProvider.error({ message: 'Internal server error', meta: { error } });
			return left(new InternalServerError('Internal server error', `${error}`));
		}
	}
}
