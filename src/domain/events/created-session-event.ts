import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
	sessionId: UUID;
};

export class CreatedSessionEvent extends Event<Data> {
	private readonly _data: Data;
	static _key = 'created-session-event';
	private readonly _k = 'created-session-event';

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
