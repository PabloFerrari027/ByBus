import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { ZodProvider } from '../config/zod-provider.js';

type Implementation = 'ZOD';

let provider: ENVProvider;

export function MakeENVProvider(implementation: Implementation) {
	switch (implementation) {
		case 'ZOD':
			if (provider instanceof ZodProvider) return provider;
			provider = new ZodProvider();
			break;
		default:
			break;
	}

	return provider;
}
