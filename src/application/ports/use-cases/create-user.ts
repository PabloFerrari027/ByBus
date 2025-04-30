import { AlreadyExists } from './../../../domain/errors/already-exists.js';
import { Either } from '@/shared/types/either.js';
import { UseCase } from './use-case.js';

export interface Input {
	name: string;
	email: string;
	password: string;
}
export type Left = AlreadyExists | null;
export type Right = null;
export type Output = Promise<Either<Left, Right>>;

export abstract class CreateUser extends UseCase<Input, Output> {}
