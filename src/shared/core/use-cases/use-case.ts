import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { InternalServerError } from '@/domain/errors/internal-server-error.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { Either, left } from '@/shared/types/either.js';

export type Left = InternalServerError | NotFound | NotAccptable | AlreadyExists;
export type Output<Right> = Promise<Either<Left, Right>>;

export abstract class UseCase<Right, Input> {
	constructor(protected readonly loggerProvider: LoggerProvider) {}
	protected abstract execute(input: Input): Output<Right>;
	public async hanlde(input: Input): Output<Right> {
		try {
			return await this.execute(input);
		} catch (error) {
			if (error instanceof NotFound) return left(error);
			if (error instanceof NotAccptable) return left(error);
			if (error instanceof AlreadyExists) return left(error);
			if (error instanceof InternalServerError) return left(error);
			await this.loggerProvider.error('Internal server error', { error });
			return left(new InternalServerError('Internal server error', `${error}`));
		}
	}
}
