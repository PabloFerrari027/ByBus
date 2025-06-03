import { NotAcceptable } from '../errors/not-accptable.js';
import { NotAllowed } from '../errors/not-allowed.js';
import { NameChangeEvent } from '../events/name-change-event.js';
import { PasswordChangeEvent } from '../events/password-change-event.js';
import { RoleChangedEvent } from '../events/role-changed-event.js';
import { VerifiedUserEvent } from '../events/verified-user-event.js';
import { Email } from '../value-objects/email.js';
import { Name } from '../value-objects/name.js';
import { Password } from '../value-objects/password.js';
import { UUID } from '../value-objects/uuid.js';

export type AuthProvider = 'CREDENTIALS' | 'GOOGLE';

export type UserRole = 'ADMIN' | 'DRIVER' | 'CLIENT';

export interface Props {
	id: UUID;
	name: Name;
	email: Email;
	password: Password | null;
	role: UserRole;
	authProvider: AuthProvider;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICreate {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	password?: string | null;
	authProvider: AuthProvider;
	emailVerified: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface JSON {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	password: string | null;
	auth_provider: AuthProvider;
	email_verified: boolean;
	created_at: string;
	updated_at: string;
}

type Events = Array<PasswordChangeEvent | NameChangeEvent | VerifiedUserEvent | RoleChangedEvent>;

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

	get role(): UserRole {
		return this.props.role;
	}

	get authProvider(): AuthProvider {
		return this.props.authProvider;
	}

	get emailVerified() {
		return this.props.emailVerified;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	set rename(value: string) {
		const isSame = this.name.compare(value);
		if (isSame) return;
		const oldName = this.name;
		const newName = Name.create(value);
		this.props.name = newName;
		this.events.push(new NameChangeEvent({ userId: this.id, newName, oldName }));
		this.touch();
	}

	set changePassword(value: string) {
		if (this.authProvider !== 'CREDENTIALS') {
			const title = 'Password Change Not Allowed';
			const message = 'Password can only be changed for users authenticated with credentials.';
			throw new NotAllowed(title, message);
		}
		const oldPassword = this.password as Password;
		const newPassword = Password.create(Password.hash(value));
		this.props.password = newPassword;
		this.events.push(new PasswordChangeEvent({ userId: this.id, newPassword, oldPassword }));
		this.touch();
	}

	set changeRoleToDriver(_: void) {
		if (this.props.role === 'DRIVER') return;
		this.props.role = 'DRIVER';
		this.events.push(
			new RoleChangedEvent({ userId: this.id, newRole: 'DRIVER', oldRole: 'CLIENT' }),
		);
		this.touch();
	}

	set markEmailAsVerified(_: void) {
		this.props.emailVerified = true;
		this.events.push(new VerifiedUserEvent({ userId: this.id }));
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
			role: this.role,
			password: this.password?.value ?? null,
			auth_provider: this.authProvider,
			email_verified: this.emailVerified,
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
		throw new NotAcceptable(title, message);
	}

	static create(props: ICreate): User {
		const id = UUID.create(props.id);
		const authProvider = props.authProvider;
		const name = Name.create(props.name);
		const email = Email.create(props.email);
		const role = props.role;
		const emailVerified = props.emailVerified;
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
			role,
			emailVerified,
			authProvider,
		});
		return user;
	}
}
