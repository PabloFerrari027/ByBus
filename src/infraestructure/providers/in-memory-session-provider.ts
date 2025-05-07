import { SessionProvider, TokenData } from '@/application/ports/providers/session-provider.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { Session } from '@/domain/entities/session.js';
import { UUID } from '@/domain/value-objects/uuid.js';

export class InMemorySessionProvider extends SessionProvider {
	private sessions: Array<Session>;

	constructor(strategy: TokenStrategy<TokenData>) {
		super(strategy);
		this.sessions = [];
	}

	async create(userId: string): Promise<Session> {
		const sessionId = UUID.create(UUID.generate());
		const accessToken = await this.tokenStrategy.create({
			userId: UUID.create(userId),
			sessionId,
		});
		const refreshToken = await this.tokenStrategy.create({
			userId: UUID.create(userId),
			sessionId,
		});
		const session = Session.create({
			id: sessionId,
			accessToken,
			refreshToken,
			userId: UUID.create(userId),
		});
		this.sessions.push(session);
		return session;
	}

	async close(session: Session): Promise<void> {
		this.sessions = this.sessions.filter(s => s.id.compare(session.id));
	}

	async revalidate(session: Session): Promise<Session> {
		const accessToken = await this.tokenStrategy.create({
			userId: session.userId,
			sessionId: session.id,
		});
		const refreshToken = await this.tokenStrategy.create({
			userId: session.userId,
			sessionId: session.id,
		});
		session.revalidate(accessToken, refreshToken);
		return session;
	}

	async findById(sessionId: string): Promise<Session | null> {
		return this.sessions.find(s => s.id.compare(sessionId)) ?? null;
	}
}
