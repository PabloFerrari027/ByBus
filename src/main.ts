import { InMemoryNotificationsProvider } from './infraestructure/providers/in-memory/in-memory-notifications-provider.js';
import { InMemoryQueuesProvider } from './infraestructure/providers/in-memory/in-memory-queues-provider.js';
import { CreateUser } from './application/use-cases/create-user.js';
import { InMemoryUsersRepository } from './infraestructure/databases/in-memory/in-memory-users-repository.js';
import { EventBus } from './infraestructure/event-bus/event-bus.js';
import { SendWelcome } from './application/event-handlers/send-welcome.js';
import { InMemoryNotificationStrategy } from './application/strategies/in-memory-notification-strategy.js';
import { CreatedUserEvent } from './domain/events/created-user-event.js';

const queuesProvider = new InMemoryQueuesProvider();
const usersRepository = new InMemoryUsersRepository();
const notificationStrategy = new InMemoryNotificationStrategy();
const notificationsProvider = new InMemoryNotificationsProvider(notificationStrategy);
const sendWelcomeEmail = new SendWelcome(notificationsProvider, usersRepository);
const createUser = new CreateUser(usersRepository);

queuesProvider.connect().then(async () => {
	const queue = await queuesProvider.create('users');
	queue.subscribe(CreatedUserEvent.name, sendWelcomeEmail);
	EventBus.subscribe(CreatedUserEvent.name, queue);
	createUser.execute({ email: 'pablo@example.com', name: 'Pablo', password: '123456' });
});
