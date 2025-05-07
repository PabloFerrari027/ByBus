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
	headers?: any;
}

export type Output = Promise<{
	status: number;
	next: boolean;
	data?: any;
}>;

export abstract class Middleware {
	constructor(protected readonly loggerProvider: LoggerProvider) {}
	protected abstract execute(input: Input): Output;
	public async handle(input: Input): Output {
		try {
			return await this.execute(input);
		} catch (error) {
			if (error instanceof AlreadyExists) {
				return {
					next: false,
					status: 409,
					data: { errors: [{ title: error.title, message: error.message }] },
				};
			} else if (error instanceof NotAccptable) {
				return {
					next: false,
					status: 406,
					data: { errors: [{ title: error.title, message: error.message }] },
				};
			} else if (error instanceof NotFound) {
				return {
					next: false,
					status: 404,
					data: { errors: [{ title: error.title, message: error.message }] },
				};
			} else if (error instanceof Unauthorized) {
				return {
					next: false,
					status: 401,
					data: { errors: [{ title: error.title, message: error.message }] },
				};
			} else if (error instanceof InternalServerError) {
				return {
					next: false,
					status: 500,
					data: { errors: [{ title: error.title, message: error.message }] },
				};
			} else {
				await this.loggerProvider.error('Internal server error', { error });
				const errors = [
					{
						title: 'Internal server error',
						message:
							'An unexpected error occurred on the server. Please try again later or contact support if the problem persists.',
					},
				];
				return { next: false, status: 500, data: { errors } };
			}
		}
	}
}
