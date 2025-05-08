import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { AlreadyExists } from '@/domain/errors/already-exists.js';
import { InternalServerError } from '@/domain/errors/internal-server-error.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { NotFound } from '@/domain/errors/not-found.js';
import { Unauthorized } from '@/domain/errors/unauthorized.js';

export interface Input {
	body?: any;
	params?: any;
	query?: any;
}

export type Output = Promise<{
	status: number;
	data?: unknown;
}>;

export abstract class Controller {
	constructor(protected readonly loggerProvider: LoggerProvider) {}
	protected abstract execute(input: Input): Output;
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
			} else if (error instanceof Unauthorized) {
				return { status: 401, data: { errors: [{ title: error.title, message: error.message }] } };
			} else if (error instanceof InternalServerError) {
				return { status: 500, data: { errors: [{ title: error.title, message: error.message }] } };
			} else {
				await this.loggerProvider.error({ message: 'Internal server error', meta: { error } });
				const errors = [
					{
						title: 'Internal server error',
						message:
							'An unexpected error occurred on the server. Please try again later or contact support if the problem persists.',
					},
				];
				return { status: 500, data: { errors } };
			}
		}
	}
}
