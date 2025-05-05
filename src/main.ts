import { NodeRouterAdapter } from './infraestructure/http/node-router-adapter.js';
import { UsersRouter } from './infraestructure/http/routers/users-router.js';
import { EventBusManager } from './infraestructure/event-bus/event-bus-manager.js';
import { QueueManager } from './infraestructure/queues/queue-manager.js';
import { MakeQueuesProvider } from './infraestructure/factories/make-queues-provider.js';
import { MakeUsersRepository } from './infraestructure/factories/make-users-repositories.js';
import { MakeNotificationsProvider } from './infraestructure/factories/make-notifications-provider.js';

const queuesProvider = MakeQueuesProvider('IN-MEMORY');
const usersRepository = MakeUsersRepository('IN-MEMORY');
const notificationsProvider = MakeNotificationsProvider('IN-MEMORY');
const eventBusManager = new EventBusManager(queuesProvider);
const queueManager = new QueueManager(queuesProvider, notificationsProvider, usersRepository);
const router = new NodeRouterAdapter();
const usersRouter = new UsersRouter(usersRepository);
router.register(usersRouter.routes);
Promise.all([
	await queueManager.registerAll(),
	await eventBusManager.registerAll(),
	await router.listen(),
]);
