import { BusStopRepository } from '@/application/ports/repositories/bus-stop-repository.js';
import { InMemoryBusStopRepository } from '../databases/in-memory-bus-stop-repository.js';

type Implementation = 'IN-MEMORY';

let repository: BusStopRepository;

export function MakeBusStopRepository(implementation: Implementation) {
	switch (implementation) {
		case 'IN-MEMORY':
			if (repository instanceof InMemoryBusStopRepository) return repository;
			repository = new InMemoryBusStopRepository();
			break;
		default:
			break;
	}

	return repository;
}
