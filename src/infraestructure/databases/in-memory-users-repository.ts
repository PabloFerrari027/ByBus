import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { User } from '@/domain/entities/user.js';
import { Email } from '@/domain/value-objects/Email.js';
import { UUID } from '@/domain/value-objects/UUID.js';

export class InMemoryUsersRepository implements UsersRepository {
	private items: User[];

	constructor() {
		this.items = [];
	}

	async create(user: User): Promise<User> {
		this.items.push(user);
		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.items.find(user => Email.compare(user.email, Email.create(email))) || null;
	}

	async findById(id: string): Promise<User | null> {
		return this.items.find(user => UUID.compare(user.id, UUID.create(id))) || null;
	}
}
