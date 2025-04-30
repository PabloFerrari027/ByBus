export abstract class Controller<Input, Output> {
	abstract execute(input: Input): Output;
}
