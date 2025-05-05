import { Middleware, Input, Output } from '@/shared/core/http/middleware.js';
import { ValidateUserSearchRequestById as ValidateRequest } from '@/shared/validators/validate-user-search-request-by-id.js';

export class ValidateUserSearchRequestById extends Middleware {
	async execute(input: Input): Output {
		const validateRequest = new ValidateRequest();
		const { errors } = validateRequest.execute(input.query);
		if (errors) return { next: false, status: 400, data: errors };
		else return { next: true, status: 200 };
	}
}
