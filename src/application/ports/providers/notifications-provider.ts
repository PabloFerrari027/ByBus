export abstract class NotificationsProvider {
	abstract send(to: string, subject: string, body: string): Promise<void>;
}
