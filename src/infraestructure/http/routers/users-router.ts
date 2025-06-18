import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { FindUserByIdController } from './../../../presentation/controllers/find-user-by-id-controller.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { FindUserByEmailController } from '@/presentation/controllers/find-user-by-email-controller.js';
import { ValidateUserSearchRequestByEmail } from '@/presentation/middlewares/validate-user-search-request-by-email.js';
import { ValidateUserSearchRequestById } from '@/presentation/middlewares/validate-user-search-request-by-id.js';
import { RouteDefinition } from '@/shared/core/http/router.js';
import { ListUsersController } from '@/presentation/controllers/list-users-controller.js';
import { ValidateUserListing } from '@/presentation/middlewares/validate-user-listing.js';
import { ValidateSession } from '@/presentation/middlewares/validate-session.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';

export class UsersRouter {
	private _routes: RouteDefinition[];

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly loggerProvider: LoggerProvider,
		private readonly tokenStrategy: TokenStrategy,
		private readonly sessionsRepository: SessionsRepository,
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
		const listUsersController = new ListUsersController(this.usersRepository, this.loggerProvider);
		const validateUserListing = new ValidateUserListing(this.loggerProvider);
		const validateSession = new ValidateSession(
			this.tokenStrategy,
			this.usersRepository,
			this.sessionsRepository,
			this.loggerProvider,
		);

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
