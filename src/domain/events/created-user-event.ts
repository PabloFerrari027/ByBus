import { UUID } from '../value-objects/uuid.js';
import { Event } from './event.js';

export class CreatedUserEvent extends Event {
	public occurredOn: Date;

	constructor(public readonly userId: UUID) {
		super();
		this.occurredOn = new Date();
	}
}
