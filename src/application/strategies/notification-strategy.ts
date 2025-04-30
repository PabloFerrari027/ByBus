export abstract class NotificationStrategy {
	abstract send(to: string, subject: string, body: string): Promise<void>;
}
