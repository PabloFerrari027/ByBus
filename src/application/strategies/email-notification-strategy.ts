import { createTransport, Transporter } from 'nodemailer';
import { NotificationStrategy } from './notification-strategy.js';
import { ENVProvider } from '../ports/providers/env-provider.js';
import { LoggerProvider } from '../ports/providers/logger-provider.js';
import { marked } from 'marked';

export class EmailNotificationStrategy extends NotificationStrategy {
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

	async send(to: string, subject: string, body: string): Promise<void> {
		const html = await marked(body);

		this.transporter.sendMail(
			{
				from: this.ENVProvider.ADMEmail,
				to,
				subject,
				html,
			},
			async (error, info) => {
				if (error) await this.loggerProvider.error('Error sending email', { error: error.message });
				if (info) await this.loggerProvider.info('Email sent successfully', { info });
			},
		);
	}
}
