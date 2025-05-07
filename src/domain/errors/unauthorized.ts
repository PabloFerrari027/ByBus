export class Unauthorized extends Error {
	readonly title: string;

	constructor(title?: string, message?: string) {
		title = title ?? 'Unauthorized';
		message =
			message ?? 'You are not authorized to access this resource. Please log in and try again.';

		super(message);
		this.title = title;
	}
}
