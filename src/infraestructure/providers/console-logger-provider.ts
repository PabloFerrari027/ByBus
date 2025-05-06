import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';

export class ConsoleLoggerProvider implements LoggerProvider {
	async connect(): Promise<void> {
		return;
	}

	async info(message: string, meta?: Record<string, unknown>): Promise<void> {
		console.log(`[INFO] ${message}`, meta || '');
	}

	async warn(message: string, meta?: Record<string, unknown>): Promise<void> {
		console.warn(`[WARN] ${message}`, meta || '');
	}

	async error(message: string, meta?: Record<string, unknown>): Promise<void> {
		console.error(`[ERROR] ${message}`, meta || '');
	}
}
