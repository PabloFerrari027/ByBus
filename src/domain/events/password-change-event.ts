import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

export class PasswordChangeEvent extends Event {
	public occurredOn: Date;
	public key = 'password-change-event';

	constructor(public readonly userId: UUID) {
		super();
		this.occurredOn = new Date();
	}
}
