import { FindUserByIdController } from './../../../presentation/controllers/find-user-by-id-controller.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { CreateUserController } from '@/presentation/controllers/create-user-controller.js';
import { FindUserByEmailController } from '@/presentation/controllers/find-user-by-email-controller copy.js';
import { ValidateUserCreationRequest } from '@/presentation/middlewares/validate-user-creation-request.js';
import { ValidateUserSearchRequestByEmail } from '@/presentation/middlewares/validate-user-search-request-by-email.js';
import { ValidateUserSearchRequestById } from '@/presentation/middlewares/validate-user-search-request-by-id.js';
import { RouteDefinition } from '@/shared/core/http/router.js';

export class UsersRouter {
	private _routes: RouteDefinition[];

	constructor(private readonly usersRepository: UsersRepository) {
		this._routes = [];
		const createUserController = new CreateUserController(this.usersRepository);
		const validateUserCreationRequest = new ValidateUserCreationRequest();
		const findUserByIdController = new FindUserByIdController(this.usersRepository);
		const validateUserSearchRequestById = new ValidateUserSearchRequestById();
		const findUserByEmailController = new FindUserByEmailController(this.usersRepository);
		const validateUserSearchRequestByEmail = new ValidateUserSearchRequestByEmail();

		this._routes.push({
			method: 'post',
			path: '/users/create',
			handler: createUserController,
			middlewares: [validateUserCreationRequest],
		});

		this._routes.push({
			method: 'get',
			path: '/users/find/by/id',
			handler: findUserByIdController,
			middlewares: [validateUserSearchRequestById],
		});
		this._routes.push({
			method: 'get',
			path: '/users/find/by/email',
			handler: findUserByEmailController,
			middlewares: [validateUserSearchRequestByEmail],
		});
	}

	get routes(): RouteDefinition[] {
		return this._routes;
	}
}
