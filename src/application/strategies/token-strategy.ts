import { Token } from '@/domain/entities/token.js';

export abstract class TokenStrategy {
	abstract create<T>(data: T, expiresAt?: Date | null): Promise<Token<T>>;
	abstract decode<T>(token: string): Promise<Token<T>>;
}
