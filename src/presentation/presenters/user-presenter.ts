import { UserJSON } from '@/domain/entities/user.js';
import { Optional } from '@/shared/types/optional.js';

export class UserPresenter {
	static format(user: Optional<UserJSON, 'password'>, fields?: Record<string, boolean>) {
		if (!fields || Object.keys(fields).length === 0) return user;
		const data: Record<string, unknown> = {};
		if (fields['id'] === true) data['id'] = user.id;
		if (fields['name'] === true) data['name'] = user.name;
		if (fields['email'] === true) data['email'] = user.email;
		if (fields['password'] === true) data['password'] = user.password;
		if (fields['updated_at'] === true) data['updated_at'] = user.updated_at;
		if (fields['created_at'] === true) data['created_at'] = user.created_at;
		return data;
	}
}
