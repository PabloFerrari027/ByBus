import { NotificationDTO } from '@/application/dtos/notification-dto.js';
import { ENVProvider } from '@/application/ports/providers/env-provider.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider as INotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { marked } from 'marked';
import { createTransport, Transporter } from 'nodemailer';

export class EmailNotificationsProvider extends INotificationsProvider {
	private readonly transporter: Transporter;

	constructor(
		private readonly ENVProvider: ENVProvider,
		private readonly loggerProvider: LoggerProvider,
	) {
		super();
		this.transporter = createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			service: 'gmail',
			auth: {
				user: this.ENVProvider.ADMEmail,
				pass: this.ENVProvider.ADMEmailPassword,
			},
		});
	}

	async send(data: NotificationDTO): Promise<void> {
		const html = await marked(data.body);

		this.transporter.sendMail(
			{
				from: this.ENVProvider.ADMEmail,
				to: data.to,
				subject: data.subject,
				html,
			},
			async (error, info) => {
				if (error)
					await this.loggerProvider.error({
						message: 'Error sending email',
						meta: { error: error.message },
					});
				if (info)
					await this.loggerProvider.info({ message: 'Email sent successfully', meta: { info } });
			},
		);
	}
}
