import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
};

export class LoginEvent extends Event<Data> {
	private readonly _data: Data;
	static _key = 'login-event';
	private readonly _k = 'login-event';

	constructor(data: Data) {
		super();
		this._data = data;
	}

	get data(): Data {
		return this._data;
	}

	static get key() {
		return this._key;
	}

	get key() {
		return this._k;
	}
}
