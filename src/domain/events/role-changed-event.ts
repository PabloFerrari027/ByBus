import { UserRole } from '../entities/user.js';
import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
	oldRole: UserRole;
	newRole: UserRole;
};

export class RoleChangedEvent extends Event<Data> {
	private readonly _data: Data;
	static _key = 'role-changed-event';
	private readonly _k = 'role-changed-event';

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
