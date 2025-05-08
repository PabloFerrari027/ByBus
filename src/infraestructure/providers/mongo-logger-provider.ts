import { LoggerDTO } from '@/application/dtos/logger-dto.js';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { Collection, MongoClient } from 'mongodb';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
	level: LogLevel;
	message: string;
	meta?: Record<string, unknown>;
	timestamp: Date;
}

export class MongoLoggerProvider implements LoggerProvider {
	private collection: Collection<LogEntry> | null;
	private isConnected: boolean;

	constructor(private readonly ENVProvider: ENVProvider) {
		this.collection = null;
		this.isConnected = false;
	}

	async connect(): Promise<void> {
		const client = await MongoClient.connect(this.ENVProvider.mongoURLConnection);
		this.collection = client.db('logs').collection('app_logs');
		this.isConnected = true;
	}

	private async log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
		if (!this.isConnected) await this.connect();

		const entry: LogEntry = {
			level,
			message,
			meta,
			timestamp: new Date(),
		};

		try {
			await this.collection?.insertOne(entry);
		} catch (err) {
			console.error('[MongoLogger] Failed to write log:', err);
		}
	}

	async info(data: LoggerDTO): Promise<void> {
		await this.log('info', data.message, data.meta);
	}

	async warn(data: LoggerDTO): Promise<void> {
		await this.log('warn', data.message, data.meta);
	}

	async error(data: LoggerDTO): Promise<void> {
		await this.log('error', data.message, data.meta);
	}
}
