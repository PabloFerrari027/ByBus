import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { InternalServerError } from '@/domain/errors/internal-server-error.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { Either, left, Right } from '@/shared/types/either.js';

export type Left = InternalServerError | NotFound | NotAccptable | AlreadyExists;
export type Output<Right> = Promise<Either<Left, Right>>;

export abstract class UseCase<R> {
	abstract execute(input: unknown): Output<R>;
	public async hanlde(input: unknown): Output<R> {
		try {
			return await this.execute(input);
		} catch (error) {
			if (error instanceof NotFound) return left(error);
			if (error instanceof NotAccptable) return left(error);
			if (error instanceof AlreadyExists) return left(error);
			if (error instanceof InternalServerError) return left(error);
			return left(new InternalServerError('Internal server error', `${error}`));
		}
	}
}
