import { AuthMethod, CredentialAuthDTO } from '@/application/dtos/auth-dto.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { Email } from '@/domain/value-objects/email.js';
import { Name } from '@/domain/value-objects/name.js';
import { Password } from '@/domain/value-objects/password.js';

export class CredentialAuthStrategy extends AuthStrategy {
	canHandle(method: AuthMethod): boolean {
		return method.toUpperCase() === 'CREDENTIALS';
	}

	async authenticate(data: CredentialAuthDTO): Promise<void> {
		Name.validate(data.credentials.name);
		Email.validate(data.credentials.email);
		Password.validate(data.credentials.password);
		const isSameAuthProvider = data.user.authProvider === 'CREDENTIALS';
		const isSameName = data.user.name.compare(data.credentials.name);
		const isSamePass = await data.user.password?.compare(data.credentials.password as string);

		if (!isSameAuthProvider || !isSameName || !isSamePass) {
			const title = 'Invalid Credentials';
			const message =
				'The credentials provided are incorrect. Please check your credentials and try again.';
			throw new NotAccptable(title, message);
		}
	}
}
