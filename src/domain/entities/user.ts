import { DomainEvents } from '@/infraestructure/event-bus/domain-events.js';
import { NotAcceptable } from '../errors/not-acceptable.js';
import { NotAllowed } from '../errors/not-allowed.js';
import { NameChangeEvent } from '../events/name-change-event.js';
import { PasswordChangeEvent } from '../events/password-change-event.js';
import { RoleChangedEvent } from '../events/role-changed-event.js';
import { VerifiedUserEvent } from '../events/verified-user-event.js';
import { Email, EmailJSON } from '../value-objects/email.js';
import { Name, NameJSON } from '../value-objects/name.js';
import { Password, PasswordJSON } from '../value-objects/password.js';
import { UUID, UUIDJSON } from '../value-objects/uuid.js';

export type AuthProvider = 'CREDENTIALS' | 'GOOGLE';

export type UserRole = 'ADMIN' | 'DRIVER' | 'CLIENT';

export interface Props {
	id: UUID;
	name: Name;
	email: Email;
	password: Password | null;
	role: UserRole;
	authProvider: AuthProvider;
	isEmailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserJSON {
	id: UUIDJSON;
	name: NameJSON;
	email: EmailJSON;
	role: UserRole;
	password: PasswordJSON | null;
	auth_provider: AuthProvider;
	is_email_verified: boolean;
	created_at: string;
	updated_at: string;
}

type Events = Array<PasswordChangeEvent | NameChangeEvent | VerifiedUserEvent | RoleChangedEvent>;

export class User {
	private props: Props;
	private static authProviderPossibilities: Array<AuthProvider> = ['CREDENTIALS', 'GOOGLE'];
	private static rolePossibilities: Array<UserRole> = ['ADMIN', 'CLIENT', 'DRIVER'];

	private constructor(props: Props) {
		this.props = props;
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

	get isEmailVerified() {
		return this.props.isEmailVerified;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	changeName(value: string) {
		const isSame = this.name.equals(value);
		if (isSame) return;
		const oldName = this.name;
		const newName = Name.create(value);
		this.props.name = newName;
		DomainEvents.dispatch([new NameChangeEvent(this.id, newName, oldName)]);
		this.touch();
	}

	async changePassword(value: string) {
		if (this.authProvider !== 'CREDENTIALS') {
			const title = 'Password Change Not Allowed';
			const message = 'Password can only be changed for users authenticated with credentials.';
			throw new NotAllowed(title, message);
		}
		const newPassword = await Password.create(value);
		this.props.password = newPassword;
		DomainEvents.dispatch([new PasswordChangeEvent(this.id)]);
		this.touch();
	}

	changeRole(newRole: UserRole) {
		if (newRole === this.props.role) return;
		const oldRole = this.props.role;
		this.props.role = newRole;
		DomainEvents.dispatch([new RoleChangedEvent(this.id, newRole, oldRole)]);
		this.touch();
	}

	markEmailAsVerified() {
		this.props.isEmailVerified = true;
		DomainEvents.dispatch([new VerifiedUserEvent(this.id)]);
		this.touch();
	}

	public async verifyPassword(plainPassword: string): Promise<boolean> {
		if (!this.password) return false;
		return await this.password.equals(plainPassword);
	}

	touch() {
		this.props.updatedAt = new Date();
	}

	toJSON(): UserJSON {
		return {
			id: this.id.toJSON(),
			email: this.email.toJSON(),
			name: this.name.toJSON(),
			role: this.role,
			password: this.password?.toJSON() ?? null,
			auth_provider: this.authProvider,
			is_email_verified: this.isEmailVerified,
			updated_at: this.updatedAt.toJSON(),
			created_at: this.createdAt.toJSON(),
		};
	}

	static validateRole(role: string): void {
		const includes = this.rolePossibilities.includes(role as UserRole);
		if (includes) return;
		const title = 'Invalid Role';
		const message = 'The specified role is not supported. Please verify the role and try again.';
		throw new NotAcceptable(title, message);
	}

	static validateAuthProvider(authProvider: string): void {
		const includes = this.authProviderPossibilities.includes(authProvider as AuthProvider);
		if (includes) return;
		const title = 'Invalid authentication provider';
		const message =
			'The specified authentication provider is not supported. Please verify the provider and try again.';
		throw new NotAcceptable(title, message);
	}

	static create(props: Props): User {
		this.validateAuthProvider(props.authProvider);

		const user = new User({
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			id: props.id,
			name: props.name,
			email: props.email,
			password: props.password,
			role: props.role,
			isEmailVerified: props.isEmailVerified,
			authProvider: props.authProvider,
		});

		return user;
	}
}
