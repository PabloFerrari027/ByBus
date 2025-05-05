export interface Input {
	body?: unknown;
	params?: unknown;
	query?: unknown;
}

export type Output = Promise<{
	status: number;
	data?: unknown;
	next: boolean;
}>;

export abstract class Middleware {
	abstract execute(input: Input): Output;
}
