import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { ValidateRequest, Output } from '../core/validators/validate-request.js';

export class ValidateUserSigninRequest extends ValidateRequest {
	execute(data: unknown): Output {
		const schema = z.object({
			name: z.string(),
			email: z.string().email(),
			auth_provider: z.string(),
			password: z.string().optional(),
			auth_token: z.string().optional(),
		});
		const response = schema.safeParse(data);
		const success = response.success;
		if (success) return { errors: null };
		return { errors: fromError(response.error).message };
	}
}
