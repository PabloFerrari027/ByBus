import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { FindUserByIdController } from './../../../presentation/controllers/find-user-by-id-controller.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { FindUserByEmailController } from '@/presentation/controllers/find-user-by-email-controller copy.js';
import { ValidateUserSearchRequestByEmail } from '@/presentation/middlewares/validate-user-search-request-by-email.js';
import { ValidateUserSearchRequestById } from '@/presentation/middlewares/validate-user-search-request-by-id.js';
import { RouteDefinition } from '@/shared/core/http/router.js';
import { ValidatePasswordResetRequest } from '@/presentation/middlewares/validate-password-reset-request.js';
import { ResetPasswordController } from '@/presentation/controllers/reset-password-controller.js';
import { ListUsersController } from '@/presentation/controllers/list-users-controller.js';
import { ValidateUserListing } from '@/presentation/middlewares/validate-user-listing.js';
import { LoginController } from '@/presentation/controllers/login-controller.js';
import { ValidateUserLoginRequest } from '@/presentation/middlewares/validate-user-login-request.js';
import { SessionProvider, TokenData } from '@/application/ports/providers/session-provider.js';
import { ValidateSession } from '@/presentation/middlewares/validate-session.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';

export class UsersRouter {
	private _routes: RouteDefinition[];

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly loggerProvider: LoggerProvider,
		private readonly sessionProvider: SessionProvider,
		private readonly authStrategies: AuthStrategy[],
		private readonly tokenStrategy: TokenStrategy<TokenData>,
	) {
		this._routes = [];
		const findUserByIdController = new FindUserByIdController(
			this.usersRepository,
			this.loggerProvider,
		);
		const validateUserSearchRequestById = new ValidateUserSearchRequestById(this.loggerProvider);
		const findUserByEmailController = new FindUserByEmailController(
			this.usersRepository,
			this.loggerProvider,
		);
		const validateUserSearchRequestByEmail = new ValidateUserSearchRequestByEmail(
			this.loggerProvider,
		);
		const resetPasswordController = new ResetPasswordController(
			this.usersRepository,
			this.loggerProvider,
		);
		const validatePasswordResetRequest = new ValidatePasswordResetRequest(this.loggerProvider);
		const listUsersController = new ListUsersController(this.usersRepository, this.loggerProvider);
		const validateUserListing = new ValidateUserListing(this.loggerProvider);
		const loginController = new LoginController(
			this.usersRepository,
			this.sessionProvider,
			this.authStrategies,
			this.loggerProvider,
		);
		const validateUserLoginRequest = new ValidateUserLoginRequest(this.loggerProvider);
		const validateSession = new ValidateSession(
			this.tokenStrategy,
			this.usersRepository,
			this.loggerProvider,
		);

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
			middlewares: [validateSession, validatePasswordResetRequest],
		});
		this._routes.push({
			method: 'get',
			path: '/users/find/by/id',
			handler: findUserByIdController,
			middlewares: [validateSession, validateUserSearchRequestById],
		});
		this._routes.push({
			method: 'get',
			path: '/users/find/by/email',
			handler: findUserByEmailController,
			middlewares: [validateSession, validateUserSearchRequestByEmail],
		});
		this._routes.push({
			method: 'get',
			path: '/users/list',
			handler: listUsersController,
			middlewares: [validateSession, validateUserListing],
		});
	}

	get routes(): RouteDefinition[] {
		return this._routes;
	}
}
