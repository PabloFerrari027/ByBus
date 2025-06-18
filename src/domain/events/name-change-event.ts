import { Name } from '../value-objects/name.js';
import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
	oldName: Name;
	newName: Name;
};

export class NameChangeEvent extends Event {
	public occurredOn: Date;

	constructor(
		public readonly userId: UUID,
		public readonly oldName: Name,
		public readonly newName: Name,
	) {
		super();
		this.occurredOn = new Date();
	}
}
