import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { TokenStrategy } from './token-strategy.js';
import jwt from 'jsonwebtoken';
import { Token } from '@/domain/entities/token.js';

export class JWTTokenStrategy<T> extends TokenStrategy<T> {
	constructor(private readonly ENVProvider: ENVProvider) {
		super();
	}

	async create(data: T, expiresAt?: Date | null): Promise<Token<T>> {
		if (expiresAt === undefined) {
			const date = new Date();
			date.setMinutes(date.getMinutes() + 60);
			expiresAt = date;
		}
		const exp = expiresAt ? Math.floor(expiresAt.getTime() / 1000) : undefined;
		const value = jwt.sign({ exp, data }, this.ENVProvider.JWTSecret);
		const token = Token.create({
			expiresAt,
			value,
			data,
		});

		return token;
	}

	async decode(token: string): Promise<Token<T>> {
		const payload = jwt.decode(token);
		console.log(payload);
		throw new Error('');
	}
}
