import { UUID } from '../value-objects/UUID.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
};

export class CreatedUserEvent extends Event<Data> {
	private readonly _data: Data;

	constructor(data: Data) {
		super();
		this._data = data;
	}

	get data(): Data {
		return this._data;
	}
}
