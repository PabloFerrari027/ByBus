import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { Session } from '@/domain/entities/session.js';
import { UUID } from '@/domain/value-objects/uuid.js';

export interface TokenData {
	userId: UUID;
	sessionId: UUID;
}

export abstract class SessionProvider {
	protected readonly tokenStrategy: TokenStrategy<TokenData>;
	constructor(strategy: TokenStrategy<TokenData>) {
		this.tokenStrategy = strategy;
	}
	abstract create(userId: UUID, sessionId: UUID): Promise<Session>;
	abstract revalidate(session: Session): Promise<Session>;
	abstract close(session: Session): Promise<void>;
	abstract findById(id: UUID): Promise<Session | null>;
}
