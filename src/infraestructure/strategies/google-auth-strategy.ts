import { AuthMethod, GoogleAuthDTO } from '@/application/dtos/auth-dto.js';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';
import { NotAcceptable } from '@/domain/errors/not-acceptable.js';
import { Email } from '@/domain/value-objects/email.js';
import { OAuth2Client } from 'google-auth-library';

export class GoogleAuthStrategy extends AuthStrategy {
	private readonly client: OAuth2Client;

	constructor(
		private readonly ENVProvider: ENVProvider,
		private readonly usersRepository: UsersRepository,
	) {
		super();
		this.client = new OAuth2Client(this.ENVProvider.googleClientId);
	}

	canHandle(method: AuthMethod): boolean {
		return method.toUpperCase() === 'GOOGLE';
	}

	async authenticate(data: GoogleAuthDTO): Promise<void> {
		console.log(data);
		Email.validate(data.email);

		const user = await this.usersRepository.findByEmail(data.email);
		if (!user) return;

		const isEmailVerified = user.isEmailVerified;
		const isSameAuthProvider = user.authProvider === 'GOOGLE';
		const isSameName = user.name.equals(data.name);

		if (!isEmailVerified || !isSameAuthProvider || !isSameName) {
			const title = 'Invalid Credentials';
			const message =
				'The credentials provided are incorrect. Please check your credentials and try again.';
			throw new NotAcceptable(title, message);
		}

		await this.client.verifyIdToken({
			idToken: data.authToken,
			audience: this.ENVProvider.googleClientId,
		});
	}
}
