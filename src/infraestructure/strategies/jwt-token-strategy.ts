import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import jwt from 'jsonwebtoken';
import { Token } from '@/domain/entities/token.js';
import { NotAcceptable } from '@/domain/errors/not-acceptable.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';

export class JWTTokenStrategy<T> extends TokenStrategy {
	constructor(private readonly ENVProvider: ENVProvider) {
		super();
	}

	async create<T>(data: T, expiresAt?: Date | null): Promise<Token<T>> {
		if (expiresAt === undefined) {
			const date = new Date();
			date.setMinutes(date.getMinutes() + 60);
			expiresAt = date;
		}
		const exp = expiresAt ? expiresAt.getTime() : undefined;
		const value = jwt.sign({ exp, sub: data }, this.ENVProvider.JWTSecret);
		const token = Token.create({
			expiresAt,
			value,
			data,
		});

		return token;
	}

	async decode<T>(token: string): Promise<Token<T>> {
		const payload = jwt.decode(token, { json: true }) as jwt.JwtPayload;
		if (!payload) {
			const title = 'Invalid token';
			const message =
				'The provided authentication token is invalid or malformed. Please log in again to obtain a valid token.';
			throw new NotAcceptable(title, message);
		}
		const expiresAt = new Date(payload.exp as number);
		const data = payload.sub as T;
		const value = token;
		return Token.create({
			data,
			expiresAt,
			value,
		});
	}
}
