export class NotAllowed extends Error {
	readonly title: string;

	constructor(title: string, message: string) {
		super(message);
		this.title = title;
	}
}
