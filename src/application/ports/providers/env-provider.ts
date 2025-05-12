export abstract class ENVProvider {
	abstract get isProduction(): boolean;
	abstract get isUnitTest(): boolean;
	abstract get isE2ETest(): boolean;
	abstract get port(): number;
	abstract get ADMEmail(): string;
	abstract get ADMEmailPassword(): string;
	abstract get mongoURLConnection(): string;
	abstract get JWTSecret(): string;
	abstract get googleClientId(): string;
	abstract get domain(): string;
	abstract get callbackURL(): string;
}
