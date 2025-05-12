import { UUID } from '../value-objects/uuid.js';

export interface Props {
	value: number;
	userId: UUID;
	expiresAt: Date;
	usedAt: Date | null;
}

export class UserVerificationCode {
	private readonly props: Props;

	constructor(props: Props) {
		this.props = props;
	}

	get value(): number {
		return this.props.value;
	}

	get userId(): UUID {
		return this.props.userId;
	}

	get expiresAt(): Date {
		return this.props.expiresAt;
	}

	get usedAt(): Date | null {
		return this.props.usedAt;
	}

	get isExpired(): boolean {
		if (!this.expiresAt) return false;
		return new Date().getTime() > this.expiresAt.getTime();
	}

	get isUsed(): boolean {
		return !!this.usedAt;
	}

	used() {
		this.props.usedAt = new Date();
	}

	static create(props: Props): UserVerificationCode {
		return new UserVerificationCode(props);
	}
}
