import { Token } from '@/domain/entities/token.js';

export abstract class TokenStrategy<T> {
	abstract create(data: T, expiresAt?: Date | null): Promise<Token<T>>;
	abstract decode(token: string): Promise<Token<T>>;
}
