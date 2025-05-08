import { LoggerDTO } from '@/application/dtos/logger-dto.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';

export class ConsoleLoggerProvider implements LoggerProvider {
	async connect(): Promise<void> {
		return;
	}

	async info(data: LoggerDTO): Promise<void> {
		console.log(`[INFO] ${data.message}`, data.meta || '');
	}

	async warn(data: LoggerDTO): Promise<void> {
		console.warn(`[WARN] ${data.message}`, data.meta || '');
	}

	async error(data: LoggerDTO): Promise<void> {
		console.error(`[ERROR] ${data.message}`, data.meta || '');
	}
}
