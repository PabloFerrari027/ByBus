import { Password } from '../value-objects/password.js';
import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

export class PasswordChangeEvent extends Event {
	public occurredOn: Date;
	public key = 'password-change-event';

	constructor(
		public readonly userId: UUID,
		public readonly oldPassword: Password,
		public readonly newPassword: Password,
	) {
		super();
		this.occurredOn = new Date();
	}
}
