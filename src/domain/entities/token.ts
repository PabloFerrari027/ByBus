export interface Props<T> {
	value: string;
	expiresAt: Date | null;
	data: T;
}

export type TokenJSON = string;

export class Token<T> {
	private readonly props: Props<T>;

	private constructor(props: Props<T>) {
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

	toJSON(): TokenJSON {
		return this.value;
	}

	compare(token: string | Token<T>): boolean {
		if (typeof token === 'string') return token === this.value;
		return this.value === token.value;
	}

	static create<T>(props: Props<T>) {
		return new Token(props);
	}
}
