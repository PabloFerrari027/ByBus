import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { ConsoleLoggerProvider } from '../providers/console-logger-provider.js';
import { MongoLoggerProvider } from '../providers/mongo-logger-provider.js';

type Implementation = 'CONSOLE' | 'MONGODB';

let provider: LoggerProvider;

export function MakeLoggerProvider(implementation: Implementation, ENVProvider: ENVProvider) {
	switch (implementation) {
		case 'CONSOLE':
			if (provider instanceof ConsoleLoggerProvider) return provider;
			provider = new ConsoleLoggerProvider();
			break;
		case 'MONGODB':
			if (provider instanceof MongoLoggerProvider) return provider;
			provider = new MongoLoggerProvider(ENVProvider);
			break;
		default:
			break;
	}

	return provider;
}
