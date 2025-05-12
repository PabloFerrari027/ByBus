import 'dotenv/config';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['PRODUCTION', 'TEST:UNIT', 'TEST:E2E']),
	PORT: z.string().transform(Number),
	ADM_EMAIL: z.string(),
	ADM_EMAIL_PASSWORD: z.string(),
	MONGO_URL_CONNECTION: z.string(),
	JWT_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	DOMAIN: z.string(),
	CALLBACK_URL: z.string(),
});

export class ZodProvider extends ENVProvider {
	private readonly variables: z.infer<typeof envSchema>;
	constructor() {
		super();
		const parsed = envSchema.safeParse(process.env);
		if (!parsed.success) {
			console.error('❌ Invalid environment variables:', parsed.error.format());
			process.exit(1);
		}
		this.variables = parsed.data;
	}

	get isProduction(): boolean {
		return this.variables.NODE_ENV === 'PRODUCTION';
	}

	get isUnitTest(): boolean {
		return this.variables.NODE_ENV === 'TEST:UNIT';
	}

	get isE2ETest(): boolean {
		return this.variables.NODE_ENV === 'TEST:E2E';
	}

	get port(): number {
		return this.variables.PORT;
	}

	get ADMEmail(): string {
		return this.variables.ADM_EMAIL;
	}

	get ADMEmailPassword(): string {
		return this.variables.ADM_EMAIL_PASSWORD;
	}

	get mongoURLConnection(): string {
		return this.variables.MONGO_URL_CONNECTION;
	}

	get JWTSecret(): string {
		return this.variables.JWT_SECRET;
	}

	get googleClientId(): string {
		return this.variables.GOOGLE_CLIENT_ID;
	}

	get domain(): string {
		return this.variables.DOMAIN;
	}

	get callbackURL(): string {
		return this.variables.CALLBACK_URL;
	}
}
