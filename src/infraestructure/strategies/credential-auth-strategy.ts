import { AuthMethod, CredentialAuthDTO } from '@/application/dtos/auth-dto.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';
import { NotAccptable } from '@/domain/errors/not-accptable.js';
import { Email } from '@/domain/value-objects/email.js';
import { Name } from '@/domain/value-objects/name.js';
import { Password } from '@/domain/value-objects/password.js';

export class CredentialAuthStrategy extends AuthStrategy {
	constructor(private readonly usersRepository: UsersRepository) {
		super();
	}

	canHandle(method: AuthMethod): boolean {
		return method.toUpperCase() === 'CREDENTIALS';
	}

	async authenticate(data: CredentialAuthDTO): Promise<void> {
		Name.validate(data.name);
		Email.validate(data.email);
		Password.validate(data.password);
		const user = await this.usersRepository.findByEmail(data.email);
		if (!user) return;
		const emailVerified = user.emailVerified;
		const isSameAuthProvider = user.authProvider === 'CREDENTIALS';
		const isSameName = user.name.compare(data.name);
		const isSamePass = await user.password?.compare(data.password);

		if (!emailVerified || !isSamePass || !isSameAuthProvider || !isSameName) {
			const title = 'Invalid Credentials';
			const message =
				'The credentials provided are incorrect. Please check your credentials and try again.';
			throw new NotAccptable(title, message);
		}
	}
}
