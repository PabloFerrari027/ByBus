import { User, Props } from '@/domain/entities/user.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export interface UsersRepository {
	create(user: User): Promise<User>;
	save(user: User): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
	findById(id: string): Promise<User | null>;
	list(options: ListingParameters<Props>): ListingResponse<User>;
}
