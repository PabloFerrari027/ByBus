import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { FindUserByIdController } from './../../../presentation/controllers/find-user-by-id-controller.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { CreateUserController } from '@/presentation/controllers/create-user-controller.js';
import { FindUserByEmailController } from '@/presentation/controllers/find-user-by-email-controller copy.js';
import { ValidateUserCreationRequest } from '@/presentation/middlewares/validate-user-creation-request.js';
import { ValidateUserSearchRequestByEmail } from '@/presentation/middlewares/validate-user-search-request-by-email.js';
import { ValidateUserSearchRequestById } from '@/presentation/middlewares/validate-user-search-request-by-id.js';
import { RouteDefinition } from '@/shared/core/http/router.js';
import { ValidatePasswordResetRequest } from '@/presentation/middlewares/validate-password-reset-request.js';
import { ResetPasswordController } from '@/presentation/controllers/reset-password-controller.js';
import { ListUsersController } from '@/presentation/controllers/list-users-controller.js';
import { ValidateUserListing } from '@/presentation/middlewares/validate-user-listing.js';
import { LoginController } from '@/presentation/controllers/login-controller.js';
import { ValidateUserLoginRequest } from '@/presentation/middlewares/validate-user-login-request.js';
import { SessionProvider } from '@/application/ports/providers/session-provider.js';

export class UsersRouter {
	private _routes: RouteDefinition[];

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly loggerProvider: LoggerProvider,
		private readonly sessionProvider: SessionProvider,
	) {
		this._routes = [];
		const createUserController = new CreateUserController(
			this.usersRepository,
			this.loggerProvider,
			this.sessionProvider,
		);
		const validateUserCreationRequest = new ValidateUserCreationRequest();
		const findUserByIdController = new FindUserByIdController(this.usersRepository);
		const validateUserSearchRequestById = new ValidateUserSearchRequestById();
		const findUserByEmailController = new FindUserByEmailController(this.usersRepository);
		const validateUserSearchRequestByEmail = new ValidateUserSearchRequestByEmail();
		const resetPasswordController = new ResetPasswordController(
			this.usersRepository,
			this.loggerProvider,
		);
		const validatePasswordResetRequest = new ValidatePasswordResetRequest();
		const listUsersController = new ListUsersController(this.usersRepository);
		const validateUserListing = new ValidateUserListing();
		const loginController = new LoginController(
			this.usersRepository,
			this.sessionProvider,
			this.loggerProvider,
		);
		const validateUserLoginRequest = new ValidateUserLoginRequest();

		this._routes.push({
			method: 'post',
			path: '/users/create',
			handler: createUserController,
			middlewares: [validateUserCreationRequest],
		});
		this._routes.push({
			method: 'post',
			path: '/users/login',
			handler: loginController,
			middlewares: [validateUserLoginRequest],
		});
		this._routes.push({
			method: 'put',
			path: '/users/reset/password',
			handler: resetPasswordController,
			middlewares: [validatePasswordResetRequest],
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
		this._routes.push({
			method: 'get',
			path: '/users/list',
			handler: listUsersController,
			middlewares: [validateUserListing],
		});
	}

	get routes(): RouteDefinition[] {
		return this._routes;
	}
}
