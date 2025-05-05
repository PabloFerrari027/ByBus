import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { InMemoryUsersRepository } from '../databases/in-memory/in-memory-users-repository.js';

type Implementation = 'IN-MEMORY';

let repository: UsersRepository;

export function MakeUsersRepository(implementation: Implementation) {
	switch (implementation) {
		case 'IN-MEMORY':
			if (repository instanceof InMemoryUsersRepository) return repository;
			repository = new InMemoryUsersRepository();
			break;
		default:
			break;
	}

	return repository;
}
