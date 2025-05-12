import { UserVerificationCodeRepository } from '@/application/ports/repositories/user-verification-code-repository.js';
import { InMemoryUserVerificationCodeRepository } from '../databases/in-memory-user-verification-code-repository.js';

type Implementation = 'IN-MEMORY';

let repository: UserVerificationCodeRepository;

export function MakeUserVerificationCodeRepository(implementation: Implementation) {
	switch (implementation) {
		case 'IN-MEMORY':
			if (repository instanceof InMemoryUserVerificationCodeRepository) return repository;
			repository = new InMemoryUserVerificationCodeRepository();
			break;
		default:
			break;
	}

	return repository;
}
