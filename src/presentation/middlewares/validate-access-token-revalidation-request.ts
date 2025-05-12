import { Middleware, Input, Output } from '@/shared/core/http/middleware.js';
import { ValidateAccessTokenRevalidationRequest as ValidateRequest } from '@/shared/validators/validate-access-token-revalidation-request.js';

export class ValidateAccessTokenRevalidationRequest extends Middleware {
	async execute(input: Input): Output {
		const validateRequest = new ValidateRequest();
		const { errors } = validateRequest.execute(input.body);
		if (errors) return { next: false, status: 400, data: errors };
		else return { next: true, status: 200 };
	}
}
