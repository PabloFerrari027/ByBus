import { Middleware, Input, Output } from '@/shared/core/http/middleware.js';
import { ValidateLogoutRequest as ValidateRequest } from '@/shared/validators/validate-logout-request.js';

export class ValidateLogoutRequest extends Middleware {
	async execute(input: Input): Output {
		const validateRequest = new ValidateRequest();
		const { errors } = validateRequest.execute(input.body);
		if (errors) return { next: false, status: 400, data: errors };
		else return { next: true, status: 200 };
	}
}
