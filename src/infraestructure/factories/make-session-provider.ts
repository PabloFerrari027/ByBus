import { SessionProvider, TokenData } from '@/application/ports/providers/session-provider.js';
import { InMemorySessionProvider } from '../providers/in-memory-session-provider.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';

type Implementation = 'IN-MEMORY';

let provider: SessionProvider;

export function MakeSessionProvider(
	implementation: Implementation,
	tokenStrategy: TokenStrategy<TokenData>,
) {
	switch (implementation) {
		case 'IN-MEMORY':
			if (provider instanceof InMemorySessionProvider) return provider;
			provider = new InMemorySessionProvider(tokenStrategy);
			break;
		default:
			break;
	}

	return provider;
}
