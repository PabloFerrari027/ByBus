import { NodeRouterAdapter } from './infraestructure/http/node-router-adapter.js';
import { UsersRouter } from './infraestructure/http/routers/users-router.js';
import { QueueManager } from './infraestructure/queues/queue-manager.js';
import { MakeQueuesProvider } from './infraestructure/factories/make-queues-provider.js';
import { MakeUsersRepository } from './infraestructure/factories/make-users-repositories.js';
import { MakeNotificationsProvider } from './infraestructure/factories/make-notifications-provider.js';
import { MakeENVProvider } from './infraestructure/factories/make-env-provider.js';
import { MakeLoggerProvider } from './infraestructure/factories/make-logger-provider.js';
import { MakeTamplateRepository } from './infraestructure/factories/make-template-repository.js';
import { MakeSessionsRepository } from './infraestructure/factories/make-session-provider.js';
import { JWTTokenStrategy } from './infraestructure/strategies/jwt-token-strategy.js';
import { CredentialAuthStrategy } from './infraestructure/strategies/credential-auth-strategy.js';
import { GoogleAuthStrategy } from './infraestructure/strategies/google-auth-strategy.js';
import { AccountRouter } from './infraestructure/http/routers/account-router.js';
import { MakeUserVerificationCodeRepository } from './infraestructure/factories/make-use-verification-code-repository.js';
import { BusRouter } from './infraestructure/http/routers/bus-router.js';
import { MakeBusRepository } from './infraestructure/factories/make-bus-repository.js';
import { DomainEventsManager } from './infraestructure/event-bus/domain-events-manager.js';

const queuesProvider = MakeQueuesProvider('IN-MEMORY');
const usersRepository = MakeUsersRepository('IN-MEMORY');
const ENVProvider = MakeENVProvider('ZOD');
const loggerProvider = MakeLoggerProvider('CONSOLE', ENVProvider);
const notificationsProvider = MakeNotificationsProvider('EMAIL', ENVProvider, loggerProvider);
const templateRepository = MakeTamplateRepository('FILE');
const tokenStrategy = new JWTTokenStrategy(ENVProvider);
const sessionsRepository = MakeSessionsRepository('IN-MEMORY');
const userVerificationCodeRepository = MakeUserVerificationCodeRepository('IN-MEMORY');
const credentialAuthStrategy = new CredentialAuthStrategy(usersRepository);
const googleAuthStrategy = new GoogleAuthStrategy(ENVProvider);
const busRepository = MakeBusRepository('IN-MEMORY');

new DomainEventsManager(queuesProvider);

const queueManager = new QueueManager(
	queuesProvider,
	notificationsProvider,
	usersRepository,
	templateRepository,
	ENVProvider,
	tokenStrategy,
	userVerificationCodeRepository,
	loggerProvider,
);

const router = new NodeRouterAdapter();
const usersRouter = new UsersRouter(
	usersRepository,
	loggerProvider,
	tokenStrategy,
	sessionsRepository,
);
const accountRouter = new AccountRouter(
	usersRepository,
	loggerProvider,
	sessionsRepository,
	[credentialAuthStrategy, googleAuthStrategy],
	tokenStrategy,
	ENVProvider,
	userVerificationCodeRepository,
);
const busRouter = new BusRouter(loggerProvider, busRepository);
router.register(usersRouter.routes);
router.register(accountRouter.routes);
router.register(busRouter.routes);
Promise.all([queueManager.registerAll(), router.listen()]);
