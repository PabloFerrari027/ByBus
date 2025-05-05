import { QueuesProvider } from '@/application/ports/providers/queues-provider.js';
import { InMemoryQueuesProvider } from '../providers/in-memory/in-memory-queues-provider.js';

type Implementation = 'IN-MEMORY';

let provider: QueuesProvider;

export function MakeQueuesProvider(implementation: Implementation) {
	switch (implementation) {
		case 'IN-MEMORY':
			if (provider instanceof InMemoryQueuesProvider) return provider;
			provider = new InMemoryQueuesProvider();
			break;
		default:
			break;
	}

	return provider;
}
