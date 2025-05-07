export interface Props<T> {
	value: string;
	expiresAt: Date | null;
	data: T;
}

export class Token<T> {
	private props: Props<T>;

	constructor(props: Props<T>) {
		this.props = props;
	}

	get data(): T {
		return this.props.data;
	}

	get value(): string {
		return this.props.value;
	}

	get expiresAt(): Date | null {
		return this.props.expiresAt;
	}

	get isExpired(): boolean {
		if (!this.expiresAt) return false;
		return new Date().getTime() > this.expiresAt.getTime();
	}

	static create<T>(props: Props<T>) {
		return new Token(props);
	}
}
