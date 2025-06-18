import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { Session } from '@/domain/entities/session.js';

export class InMemorySessionsRepository extends SessionsRepository {
	private sessions: Array<Session>;

	constructor() {
		super();
		this.sessions = [];
	}

	async create(session: Session): Promise<Session> {
		this.sessions.push(session);
		return session;
	}

	async save(session: Session): Promise<Session> {
		this.sessions = this.sessions.filter(s => s.id.equals(session.id));
		return session;
	}

	async findById(id: string): Promise<Session | null> {
		return this.sessions.find(i => i.id.equals(id)) ?? null;
	}
}
