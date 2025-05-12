import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { RouteDefinition } from '@/shared/core/http/router.js';
import { ValidatePasswordResetRequest } from '@/presentation/middlewares/validate-password-reset-request.js';
import { ResetPasswordController } from '@/presentation/controllers/reset-password-controller.js';
import { LoginController } from '@/presentation/controllers/login-controller.js';
import { ValidateUserLoginRequest } from '@/presentation/middlewares/validate-user-login-request.js';
import { SessionsRepository } from '@/application/ports/repositories/sessions-repository.js';
import { ValidateSession } from '@/presentation/middlewares/validate-session.js';
import { TokenStrategy } from '@/application/strategies/token-strategy.js';
import { AuthStrategy } from '@/application/strategies/auth-strategy.js';
import { ValidateAccountController } from '@/presentation/controllers/validate-account-controller.js';
import { ValidateAccountValidationRequest } from '@/presentation/middlewares/validate-account-validation-request.js';
import { UserVerificationCodeRepository } from '@/application/ports/repositories/user-verification-code-repository.js';
import { LogoutController } from '@/presentation/controllers/logout-controller.js';
import { ValidateLogoutRequest } from '@/presentation/middlewares/validate-logout-request.js';

export class AccountRouter {
	private _routes: RouteDefinition[];

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly loggerProvider: LoggerProvider,
		private readonly sessionsRepository: SessionsRepository,
		private readonly authStrategies: AuthStrategy[],
		private readonly tokenStrategy: TokenStrategy,
		private readonly ENVProvider: ENVProvider,
		private readonly userVerificationCodeRepository: UserVerificationCodeRepository,
	) {
		this._routes = [];
		const resetPasswordController = new ResetPasswordController(
			this.usersRepository,
			this.loggerProvider,
		);
		const validatePasswordResetRequest = new ValidatePasswordResetRequest(this.loggerProvider);
		const loginController = new LoginController(
			this.usersRepository,
			this.sessionsRepository,
			this.authStrategies,
			this.tokenStrategy,
			this.loggerProvider,
		);
		const validateUserLoginRequest = new ValidateUserLoginRequest(this.loggerProvider);
		const validateSession = new ValidateSession(
			this.tokenStrategy,
			this.usersRepository,
			this.sessionsRepository,
			this.loggerProvider,
		);
		const validateAccountController = new ValidateAccountController(
			this.usersRepository,
			this.userVerificationCodeRepository,
			this.loggerProvider,
		);
		const validateAccountValidationRequest = new ValidateAccountValidationRequest(
			this.loggerProvider,
		);
		const logoutController = new LogoutController(this.sessionsRepository, this.loggerProvider);
		const validateLogoutRequest = new ValidateLogoutRequest(this.loggerProvider);

		this._routes.push({
			method: 'post',
			path: '/account/validate',
			handler: validateAccountController,
			middlewares: [validateAccountValidationRequest],
		});
		this._routes.push({
			method: 'post',
			path: '/account/login',
			handler: loginController,
			middlewares: [validateUserLoginRequest],
		});
		this._routes.push({
			method: 'post',
			path: '/account/logout',
			handler: logoutController,
			middlewares: [validateSession, validateLogoutRequest],
		});
		this._routes.push({
			method: 'put',
			path: '/account/reset/password',
			handler: resetPasswordController,
			middlewares: [validateSession, validatePasswordResetRequest],
		});
	}

	get routes(): RouteDefinition[] {
		return this._routes;
	}
}
