import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { User } from '@/domain/entities/user.js';
import { Email } from '@/domain/value-objects/email.js';
import { Name } from '@/domain/value-objects/name.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export class InMemoryUsersRepository implements UsersRepository {
	private items: User[];

	constructor() {
		this.items = [];
	}

	private sort(a: User, b: User, orderBy: keyof User, ordem: 'ASC' | 'DESC'): number {
		const valorA = a[orderBy];
		const valorB = b[orderBy];

		if (valorA instanceof Date && valorB instanceof Date) {
			return ordem === 'ASC'
				? valorA.getTime() - valorB.getTime()
				: valorB.getTime() - valorA.getTime();
		}

		if (valorA instanceof UUID && valorB instanceof UUID) {
			return ordem === 'ASC'
				? valorA.value.localeCompare(valorB.value)
				: valorB.value.localeCompare(valorA.value);
		}

		if (valorA instanceof Name && valorB instanceof Name) {
			return ordem === 'ASC'
				? valorA.value.localeCompare(valorB.value)
				: valorB.value.localeCompare(valorA.value);
		}

		if (valorA instanceof Email && valorB instanceof Email) {
			return ordem === 'ASC'
				? valorA.value.localeCompare(valorB.value)
				: valorB.value.localeCompare(valorA.value);
		}

		return 0;
	}

	async create(user: User): Promise<User> {
		this.items.push(user);
		return user;
	}

	async save(user: User): Promise<User> {
		this.items = this.items.map(u => (u.id.compare(user.id) ? user : u));
		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.items.find(user => Email.compare(user.email, Email.create(email))) || null;
	}

	async findById(id: string): Promise<User | null> {
		return this.items.find(user => UUID.compare(user.id, UUID.create(id))) || null;
	}

	async list(options: ListingParameters<User>): ListingResponse<User> {
		const start = (options.page - 1) * 100;
		const end = start + 100;

		const pages = Math.ceil(this.items.length / 100);

		const data = this.items
			.slice(start, end)
			.sort((a, b) => this.sort(a, b, options.orderBy, options.ordem));

		return { data, pages };
	}
}
