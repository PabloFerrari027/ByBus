import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { ValidateRequest, Output } from '../../shared/core/validators/validate-request.js';

export class ValidateAccountValidationRequest extends ValidateRequest {
	execute(data: unknown): Output {
		const schema = z.object({
			code: z.number(),
			user_id: z.string(),
		});
		const response = schema.safeParse(data);
		const success = response.success;
		if (success) return { errors: null };
		return { errors: fromError(response.error).message };
	}
}
