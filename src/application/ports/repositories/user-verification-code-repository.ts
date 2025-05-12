import { UserVerificationCode } from '@/domain/entities/user-verification-code.js';

export interface UserVerificationCodeRepository {
	create(userVerificationCode: UserVerificationCode): Promise<UserVerificationCode>;
	find(value: number, userId: string): Promise<UserVerificationCode | null>;
	save(userVerificationCode: UserVerificationCode): Promise<UserVerificationCode>;
}
