import { LoggerDTO } from '@/application/dtos/logger-dto.js';

export interface LoggerProvider {
	connect(): Promise<void>;
	info(data: LoggerDTO): Promise<void>;
	warn(data: LoggerDTO): Promise<void>;
	error(data: LoggerDTO): Promise<void>;
}
