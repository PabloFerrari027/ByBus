import { UpdatedUserEvent } from '../events/updated-user-event.js';
import { Email } from '../value-objects/Email.js';
import { Password } from '../value-objects/Password.js';
import { Text } from '../value-objects/Text.js';
import { UUID } from '../value-objects/UUID.js';

export interface Props {
	id: UUID;
	name: Text;
	email: Email;
	password: Password;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreate {
	id?: string;
	name: string;
	email: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface JSON {
	id: string;
	name: string;
	email: string;
	password: string;
	created_at: string;
	updated_at: string;
}

export class User {
	private props: Props;
	private events: Array<UpdatedUserEvent>;

	private constructor(props: Props) {
		this.props = props;
		this.events = [];
	}

	get id(): UUID {
		return this.props.id;
	}

	get name(): Text {
		return this.props.name;
	}

	get email(): Email {
		return this.props.email;
	}

	get password(): Password {
		return this.props.password;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	set rename(value: string) {
		this.props.name = Text.create(value, 'PASCALCASE');
		this.events.push(new UpdatedUserEvent({ userId: this.id, updatedPropertie: 'name' }));
		this.touch();
	}

	set changeEmail(value: string) {
		this.props.email = Email.create(value);
		this.events.push(new UpdatedUserEvent({ userId: this.id, updatedPropertie: 'email' }));
		this.touch();
	}

	set changePassword(value: string) {
		this.props.password = Password.create(value);
		this.events.push(new UpdatedUserEvent({ userId: this.id, updatedPropertie: 'password' }));
		this.touch();
	}

	touch() {
		this.props.updatedAt = new Date();
		this.events.push(new UpdatedUserEvent({ userId: this.id, updatedPropertie: 'updatedAt' }));
	}

	pullEvents(): Array<UpdatedUserEvent> {
		const events = this.events;
		this.events = [];
		return events;
	}

	toJSON(): JSON {
		return {
			id: this.id.value,
			email: this.email.value,
			name: this.name.value,
			password: this.password.value,
			updated_at: this.updatedAt.toJSON(),
			created_at: this.createdAt.toJSON(),
		};
	}

	static create(props: ICreate): User {
		const name = Text.create(props.name, 'PASCALCASE');
		const email = Email.create(props.email);
		const password = Password.create(Password.hash(props.password));
		const id = UUID.create(props.id);
		const createdAt = props.createdAt ?? new Date();
		const updatedAt = props.updatedAt ?? new Date();

		const user = new User({ createdAt, updatedAt, id, name, email, password });

		return user;
	}
}
