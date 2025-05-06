export interface LoggerProvider {
	connect(): Promise<void>;
	info(message: string, meta?: Record<string, unknown>): Promise<void>;
	warn(message: string, meta?: Record<string, unknown>): Promise<void>;
	error(message: string, meta?: Record<string, unknown>): Promise<void>;
}
