import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { ValidateRequest, Output } from '../core/validators/validate-request.js';

export class ValidateUserSearchRequestByEmail extends ValidateRequest {
	execute(data: unknown): Output {
		const schema = z.object({
			email: z.string().email(),
		});
		const response = schema.safeParse(data);
		const success = response.success;
		if (success) return { errors: null };
		return { errors: fromError(response.error).message };
	}
}
