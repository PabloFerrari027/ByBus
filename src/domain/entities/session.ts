import { UUID, UUIDJSON } from '../value-objects/uuid.js';
import { Token, TokenJSON } from './token.js';

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

export interface SessionJSON {
	id: UUIDJSON;
	user_id: UUIDJSON;
	refresh_token: string;
	closed_at: string | null;
}

export class Session {
	private readonly props: Props;

	private constructor(props: Props) {
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

	toJSON(): SessionJSON {
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
