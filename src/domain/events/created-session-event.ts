import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

export class CreatedSessionEvent extends Event {
	public occurredOn: Date;

	constructor(
		public readonly userId: UUID,
		public readonly sessionId: UUID,
	) {
		super();
		this.occurredOn = new Date();
	}
}
