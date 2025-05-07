import { NameChangeEvent } from '../events/name-change-event.js';
import { PasswordChangeEvent } from '../events/password-change-event.js';
import { Email } from '../value-objects/Email.js';
import { Name } from '../value-objects/Name.js';
import { Password } from '../value-objects/Password.js';
import { UUID } from '../value-objects/UUID.js';

export interface Props {
	id: UUID;
	name: Name;
	email: Email;
	password: Password;
	sessionId: UUID;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreate {
	id: string;
	name: string;
	email: string;
	sessionId: UUID;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface JSON {
	id: string;
	name: string;
	email: string;
	password: string;
	session_id: string;
	created_at: string;
	updated_at: string;
}

type Events = Array<PasswordChangeEvent | NameChangeEvent>;

export class User {
	private props: Props;
	private events: Events;

	private constructor(props: Props) {
		this.props = props;
		this.events = [];
	}

	get id(): UUID {
		return this.props.id;
	}

	get name(): Name {
		return this.props.name;
	}

	get email(): Email {
		return this.props.email;
	}

	get password(): Password {
		return this.props.password;
	}

	get sessionId(): UUID {
		return this.props.sessionId;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	set rename(value: string) {
		this.props.name = Name.create(value);
		this.events.push(new NameChangeEvent({ userId: this.id }));
		this.touch();
	}

	set changePassword(value: string) {
		this.props.password = Password.create(Password.hash(value));
		this.events.push(new PasswordChangeEvent({ userId: this.id }));
		this.touch();
	}

	touch() {
		this.props.updatedAt = new Date();
	}

	pullEvents(): Events {
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
			session_id: this.sessionId.value,
			updated_at: this.updatedAt.toJSON(),
			created_at: this.createdAt.toJSON(),
		};
	}

	static create(props: ICreate): User {
		const id = UUID.create(props.id);
		const sessionId = props.sessionId;
		const name = Name.create(props.name);
		const email = Email.create(props.email);
		const password = Password.create(Password.hash(props.password));
		const createdAt = props.createdAt ?? new Date();
		const updatedAt = props.updatedAt ?? new Date();
		const user = new User({ createdAt, updatedAt, id, name, email, password, sessionId });
		return user;
	}
}
