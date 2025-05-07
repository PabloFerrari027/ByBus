import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
};

export class PasswordChangeEvent extends Event<Data> {
	private readonly _data: Data;
	static _key = 'password-change-event';
	private readonly _k = 'password-change-event';

	constructor(data: Data) {
		super();
		this._data = data;
	}

	get data(): Data {
		return this._data;
	}

	static get key(): string {
		return this._key;
	}

	get key(): string {
		return this._k;
	}
}
