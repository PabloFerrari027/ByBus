import { UserRole } from '../entities/user.js';
import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

type Data = {
	userId: UUID;
	oldRole: UserRole;
	newRole: UserRole;
};

export class RoleChangedEvent extends Event {
	public occurredOn: Date;

	constructor(
		public readonly userId: UUID,
		public readonly oldRole: UserRole,
		public readonly newRole: UserRole,
	) {
		super();
		this.occurredOn = new Date();
	}
}
