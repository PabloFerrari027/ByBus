import { UUID } from '../value-objects/UUID.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
};

export class NameChangeEvent extends Event<Data> {
	private readonly _data: Data;
	static _key = 'name-change-event';
	private readonly _k = 'name-change-event';

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
