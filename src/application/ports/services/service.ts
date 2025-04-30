import { Either } from '@/shared/types/either.js';

export abstract class Service<Input, Left, Right> {
	abstract execute(input: Input): Promise<Either<Left, Right>>;
}
