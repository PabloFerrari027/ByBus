import { AuthMethod, GoogleAuthDTO } from '@/application/dtos/auth-dto.js';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { Email } from '@/domain/value-objects/email.js';
import { OAuth2Client } from 'google-auth-library';

export class GoogleAuthStrategy extends AuthStrategy {
	private readonly client: OAuth2Client;

	constructor(private readonly ENVProvider: ENVProvider) {
		super();
		this.client = new OAuth2Client(this.ENVProvider.googleClientId);
	}

	canHandle(method: AuthMethod): boolean {
		return method.toUpperCase() === 'GOOGLE';
	}

	async authenticate(data: GoogleAuthDTO): Promise<void> {
		Email.validate(data.credentials.email);

		const isSameAuthProvider = data.user.authProvider === 'GOOGLE';

		if (!isSameAuthProvider) {
			const title = 'Invalid Credentials';
			const message =
				'The credentials provided are incorrect. Please check your credentials and try again.';
			throw new NotAccptable(title, message);
		}

		await this.client.verifyIdToken({
			idToken: data.credentials.authToken,
			audience: this.ENVProvider.googleClientId,
		});
	}
}
