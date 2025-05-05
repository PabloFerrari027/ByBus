export abstract class Handler {
	abstract execute(input: unknown): Promise<void>;
}
