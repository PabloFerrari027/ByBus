import { AuthMethod, GoogleAuthDTO } from '@/application/dtos/auth-dto.js';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';
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
		Email.validate(data.email);
		await this.client.verifyIdToken({
			idToken: data.authToken,
			audience: this.ENVProvider.googleClientId,
		});
	}
}
