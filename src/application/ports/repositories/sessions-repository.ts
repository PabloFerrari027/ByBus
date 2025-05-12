import { Session } from '@/domain/entities/session.js';

export abstract class SessionsRepository {
	abstract create(session: Session): Promise<Session>;
	abstract save(session: Session): Promise<Session>;
	abstract findById(id: string): Promise<Session | null>;
}
