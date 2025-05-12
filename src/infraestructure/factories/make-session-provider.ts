import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { InMemorySessionsRepository } from '../providers/in-memory-sessions-repository.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';

type Implementation = 'IN-MEMORY';

let provider: SessionsRepository;

export function MakeSessionsRepository(implementation: Implementation) {
	switch (implementation) {
		case 'IN-MEMORY':
			if (provider instanceof InMemorySessionsRepository) return provider;
			provider = new InMemorySessionsRepository();
			break;
		default:
			break;
	}

	return provider;
}
