import { UserVerificationCode } from '@/domain/entities/user-verification-code.js';
import { UserVerificationCodeRepository } from './../../application/ports/repositories/user-verification-code-repository.js';

export class InMemoryUserVerificationCodeRepository implements UserVerificationCodeRepository {
	private items: Array<UserVerificationCode>;

	constructor() {
		this.items = [];
	}

	async create(userVerificationCode: UserVerificationCode): Promise<UserVerificationCode> {
		this.items.push(userVerificationCode);
		return userVerificationCode;
	}

	async save(userVerificationCode: UserVerificationCode): Promise<UserVerificationCode> {
		this.items = this.items.map(i =>
			i.userId.equals(userVerificationCode.userId) && userVerificationCode.value === i.value
				? userVerificationCode
				: i,
		);
		return userVerificationCode;
	}

	async find(value: number, userId: string): Promise<UserVerificationCode | null> {
		return this.items.find(i => i.userId.equals(userId) && i.value === value) ?? null;
	}
}
