import { Middleware, Input, Output } from '@/shared/core/http/middleware.js';
import { ValidateUserSearchRequestByEmail as ValidateRequest } from '@/shared/validators/validate-user-search-request-by-email.js';

export class ValidateUserSearchRequestByEmail extends Middleware {
	async execute(input: Input): Output {
		const validateRequest = new ValidateRequest();
		const { errors } = validateRequest.execute(input.query);
		if (errors) return { next: false, status: 400, data: errors };
		else return { next: true, status: 200 };
	}
}
