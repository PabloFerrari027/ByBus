import { AuthDTO, AuthMethod } from '@/application/dtos/auth-dto.js';

export abstract class AuthStrategy {
	abstract canHandle(method: AuthMethod): boolean;
	abstract authenticate(dto: AuthDTO): Promise<void>;
}
