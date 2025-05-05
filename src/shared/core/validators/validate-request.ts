export type Output = { errors: string | null };

export abstract class ValidateRequest {
	abstract execute(data: unknown): Output;
}
