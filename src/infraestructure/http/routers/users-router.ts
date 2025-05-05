import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { CreateUserController } from '@/presentation/controllers/create-user-controller.js';
import { ValidateUserCreationRequest } from '@/presentation/middlewares/validate-user-creation-request.js';
import { RouteDefinition } from '@/shared/core/http/router.js';

export class UsersRouter {
	private _routes: RouteDefinition[];

	constructor(private readonly usersRepository: UsersRepository) {
		this._routes = [];
		const createUserController = new CreateUserController(this.usersRepository);
		const validateUserCreationRequest = new ValidateUserCreationRequest();

		this._routes.push({
			method: 'post',
			path: '/users/create',
			handler: createUserController,
			middlewares: [validateUserCreationRequest],
		});
	}

	get routes(): RouteDefinition[] {
		return this._routes;
	}
}
