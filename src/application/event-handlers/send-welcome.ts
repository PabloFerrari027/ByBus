import { UsersRepository } from '../ports/repositories/users-repository.js';
import { Handler } from '../ports/handler/handler.js';
import { CreatedUserEvent } from '@/domain/events/created-user-event.js';
import { User } from '@/domain/entities/user.js';
import { NotificationsProvider } from '../ports/providers/notifications-provider.js';

export class SendWelcome extends Handler {
	private user: User | null;

	constructor(
		private readonly notificationsProvider: NotificationsProvider,
		private readonly usersRepository: UsersRepository,
	) {
		super();
		this.user = null;
	}

	async execute(event: CreatedUserEvent) {
		this.user = await this.usersRepository.findById(event.data.userId.value);

		if (!this.user) {
			await this.notificationsProvider.send(
				'to@gmail.com',
				'User not found',
				`User with ID ${event.data.userId.value} not found`,
			);

			return;
		}

		await this.notificationsProvider.send(
			this.user.email.value,
			'Welcome to our service',
			`Hello ${this.user.name.value}, welcome to our service!`,
		);
	}
}
