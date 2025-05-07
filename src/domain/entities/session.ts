import { UUID } from '../value-objects/uuid.js';
import { Token } from './token.js';

interface TokenData {
	userId: UUID;
	sessionId: UUID;
}

export interface Props {
	id: UUID;
	userId: UUID;
	accessToken: Token<TokenData>;
	refreshToken: Token<TokenData>;
}

export interface JSON {
	id: string;
	user_id: string;
	access_token: string;
	refresh_token: string;
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

	get accessToken(): Token<TokenData> {
		return this.props.accessToken;
	}

	get refreshToken(): Token<TokenData> {
		return this.props.refreshToken;
	}

	revalidate(accessToken: Token<TokenData>, refreshToken: Token<TokenData>): Session {
		this.props.accessToken = accessToken;
		this.props.refreshToken = refreshToken;
		return this;
	}

	static create(props: Props): Session {
		return new Session(props);
	}

	toJSON(): JSON {
		return {
			id: this.id.value,
			user_id: this.userId.value,
			access_token: this.accessToken.value,
			refresh_token: this.refreshToken.value,
		};
	}
}
