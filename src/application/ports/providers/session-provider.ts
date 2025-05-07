import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { Session } from '@/domain/entities/session.js';
import { UUID } from '@/domain/value-objects/UUID.js';

export interface TokenData {
	userId: UUID;
	sessionId: UUID;
}

export abstract class SessionProvider {
	protected readonly tokenStrategy: TokenStrategy<TokenData>;
	constructor(strategy: TokenStrategy<TokenData>) {
		this.tokenStrategy = strategy;
	}
	abstract create(userId: string): Promise<Session>;
	abstract revalidate(session: Session): Promise<Session>;
	abstract close(session: Session): Promise<void>;
	abstract findById(id: string): Promise<Session | null>;
}
