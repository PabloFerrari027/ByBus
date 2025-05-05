import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { NotFound } from '@/domain/errors/not-found.js';

export interface Input {
	body?: unknown;
	params?: unknown;
	query?: unknown;
}

export type Output = Promise<{
	status: number;
	data?: unknown;
}>;

export abstract class Controller {
	abstract execute(input: Input): Output;
	public async handle(input: Input): Output {
		try {
			return await this.execute(input);
		} catch (error) {
			if (error instanceof AlreadyExists) {
				return { status: 409, data: { errors: [{ title: error.title, message: error.message }] } };
			} else if (error instanceof NotAccptable) {
				return { status: 406, data: { errors: [{ title: error.title, message: error.message }] } };
			} else if (error instanceof NotFound) {
				return { status: 404, data: { errors: [{ title: error.title, message: error.message }] } };
			} else {
				return {
					status: 500,
					data: { errors: [{ title: 'Internal server error', message: `${error}` }] },
				};
			}
		}
	}
}
