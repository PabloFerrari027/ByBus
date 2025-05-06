export abstract class Event<T> {
	static _key = 'event';
	static get key(): string {
		return this._key;
	}
	abstract get data(): T;
	abstract get key(): string;
}
