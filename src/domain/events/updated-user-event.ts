import { Props } from '../entities/user.js';
import { UUID } from '../value-objects/UUID.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
	updatedPropertie: keyof Props;
};

export class UpdatedUserEvent extends Event<Data> {
	private readonly _data: Data;

	constructor(data: Data) {
		super();
		this._data = data;
	}

	get data(): Data {
		return this._data;
	}
}
