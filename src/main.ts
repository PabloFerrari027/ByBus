import { NodeRouterAdapter } from './infraestructure/http/node-router-adapter.js';
import { UsersRouter } from './infraestructure/http/routers/users-router.js';
import { EventBusManager } from './infraestructure/event-bus/event-bus-manager.js';
import { QueueManager } from './infraestructure/queues/queue-manager.js';
import { MakeQueuesProvider } from './infraestructure/factories/make-queues-provider.js';
import { MakeUsersRepository } from './infraestructure/factories/make-users-repositories.js';
import { MakeNotificationsProvider } from './infraestructure/factories/make-notifications-provider.js';
import { MakeENVProvider } from './infraestructure/factories/make-env-provider.js';
import { MakeLoggerProvider } from './infraestructure/factories/make-logger-provider.js';
import { MakeTamplateRepository } from './infraestructure/factories/make-template-repository.js';
import { MakeSessionProvider } from './infraestructure/factories/make-session-provider.js';
import { JWTTokenStrategy } from './application/strategies/jwt-token-strategy.js';
import { TokenData } from './application/ports/providers/session-provider.js';

const queuesProvider = MakeQueuesProvider('IN-MEMORY');
const usersRepository = MakeUsersRepository('IN-MEMORY');
const ENVProvider = MakeENVProvider('ZOD');
const loggerProvider = MakeLoggerProvider('CONSOLE', ENVProvider);
const notificationsProvider = MakeNotificationsProvider('CONSOLE', ENVProvider, loggerProvider);
const templateRepository = MakeTamplateRepository('FILE');
const tokenStrategy = new JWTTokenStrategy<TokenData>(ENVProvider);
const sessionProvider = MakeSessionProvider('IN-MEMORY', tokenStrategy);
const eventBusManager = new EventBusManager(queuesProvider);
const queueManager = new QueueManager(
	queuesProvider,
	notificationsProvider,
	usersRepository,
	templateRepository,
	loggerProvider,
);
const router = new NodeRouterAdapter();
const usersRouter = new UsersRouter(usersRepository, loggerProvider, sessionProvider);
router.register(usersRouter.routes);
Promise.all([
	await queueManager.registerAll(),
	await eventBusManager.registerAll(),
	await router.listen(),
]);
