import { UUID } from '../value-objects/uuid.js';
import { Token } from './token.js';

export type RefreshToken = Token<{
	userId: UUID;
	sessionId: UUID;
}>;

export interface Props {
	id: UUID;
	userId: UUID;
	refreshToken: RefreshToken;
	closedAt: Date | null;
}

export interface JSON {
	id: string;
	user_id: string;
	refresh_token: string;
	closed_at: string | null;
}

export class Session {
	private props: Props;

	constructor(props: Props) {
		this.props = props;
	}

	get id(): UUID {
		return this.props.id;
	}

	get userId(): UUID {
		return this.props.userId;
	}

	get refreshToken(): RefreshToken {
		return this.props.refreshToken;
	}

	get closedAt(): Date | null {
		return this.props.closedAt;
	}

	toJSON(): JSON {
		return {
			id: this.id.value,
			user_id: this.userId.value,
			closed_at: this.closedAt ? this.closedAt.toJSON() : null,
			refresh_token: this.refreshToken.value,
		};
	}

	isClosed(): boolean {
		return !!this.closedAt;
	}

	close() {
		this.props.closedAt = new Date();
	}

	static create(props: Props): Session {
		return new Session(props);
	}
}
