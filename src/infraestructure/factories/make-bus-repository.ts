import { BusRepository } from '@/application/ports/repositories/bus-repository.js';
import { InMemoryBusRepository } from '../databases/in-memory-bus-repositories.js';

type Implementation = 'IN-MEMORY';

let repository: BusRepository;

export function MakeBusRepository(implementation: Implementation) {
	switch (implementation) {
		case 'IN-MEMORY':
			if (repository instanceof InMemoryBusRepository) return repository;
			repository = new InMemoryBusRepository();
			break;
		default:
			break;
	}

	return repository;
}
