import { NotAccptable } from '../errors/not-accptable.js';
import { NameChangeEvent } from '../events/name-change-event.js';
import { PasswordChangeEvent } from '../events/password-change-event.js';
import { Email } from '../value-objects/email.js';
import { Name } from '../value-objects/name.js';
import { Password } from '../value-objects/password.js';
import { UUID } from '../value-objects/uuid.js';

export type AuthProvider = 'CREDENTIALS' | 'GOOGLE';
export interface Props {
	id: UUID;
	name: Name;
	email: Email;
	password: Password | null;
	sessionId: UUID;
	authProvider: AuthProvider;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreate {
	id: string;
	name: string;
	email: string;
	sessionId: string;
	password?: string | null;
	authProvider: AuthProvider;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface JSON {
	id: string;
	name: string;
	email: string;
	password: string | null;
	session_id: string;
	auth_provider: AuthProvider;
	created_at: string;
	updated_at: string;
}

type Events = Array<PasswordChangeEvent | NameChangeEvent>;

export class User {
	private props: Props;
	private events: Events;
	private static authProviderPossibilities: Array<AuthProvider> = ['CREDENTIALS', 'GOOGLE'];

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

	get password(): Password | null {
		return this.props.password;
	}

	get sessionId(): UUID {
		return this.props.sessionId;
	}

	get authProvider(): AuthProvider {
		return this.props.authProvider;
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
			password: this.password?.value ?? null,
			session_id: this.sessionId.value,
			auth_provider: this.authProvider,
			updated_at: this.updatedAt.toJSON(),
			created_at: this.createdAt.toJSON(),
		};
	}

	static validateAuthProvider(authProvider: string): void {
		const includes = this.authProviderPossibilities.includes(authProvider as AuthProvider);
		if (includes) return;
		const title = 'Invalid authentication provider';
		const message =
			'The specified authentication provider is not supported. Please verify the provider and try again.';
		throw new NotAccptable(title, message);
	}

	static create(props: ICreate): User {
		const id = UUID.create(props.id);
		const sessionId = UUID.create(props.sessionId);
		const authProvider = props.authProvider;
		const name = Name.create(props.name);
		const email = Email.create(props.email);
		const password = props.password ? Password.create(Password.hash(props.password)) : null;
		const createdAt = props.createdAt ?? new Date();
		const updatedAt = props.updatedAt ?? new Date();
		const user = new User({
			createdAt,
			updatedAt,
			id,
			name,
			email,
			password,
			sessionId,
			authProvider,
		});
		return user;
	}
}
