import { InvoiceProvider } from '@/application/ports/providers/invoice-provider.js';
import { LoggerProvider } from '@/application/ports/providers/logger-provider.js';
import { NotificationsProvider } from '@/application/ports/providers/notifications-provider.js';
import { BusTicketRepository } from '@/application/ports/repositories/bus-ticket-repository.js';
import { InvoiceRepository } from '@/application/ports/repositories/invoice-repository.js';
import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { UsersRepository } from '@/application/ports/repositories/users-repository.js';
import { NotificationService } from '@/application/services/notification-service.js';
import {
	PaymentMethod,
	PaymentProvider,
	PaymentStrategy,
} from '@/application/strategies/payment-strategy.js';
import { Invoice } from '@/domain/entities/invoice.js';
import { User } from '@/domain/entities/user.js';
import { InternalServerError } from '@/domain/errors/internal-server-error.js';
import { InvoiceNumber } from '@/domain/value-objects/invoice-number.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { Handler } from '@/shared/core/queues/handler.js';

interface Input {
	userId: UUID;
	ticketId: UUID;
	paymentMethod: PaymentMethod;
	paymentProvider: PaymentProvider;
	transactionId: string;
}

export class GenerateinvoiceHandler extends Handler {
	private user: User | null;

	constructor(
		private readonly invoiceProvider: InvoiceProvider,
		private readonly usersRepository: UsersRepository,
		private readonly busTicketRepository: BusTicketRepository,
		private readonly invoiceRepository: InvoiceRepository,
		private readonly paymentStrategy: PaymentStrategy,
		private readonly loggerProvider: LoggerProvider,
		private readonly templateRepository: TemplateRepository,
		private readonly notificationsProvider: NotificationsProvider,
	) {
		super();
		this.user = null;
	}

	async execute(input: Input) {
		const ticket = await this.busTicketRepository.findById(input.ticketId.value);

		if (!ticket) {
			const title = '';
			const message = '';
			throw new InternalServerError(title, message);
		}

		const user = await this.usersRepository.findById(input.userId.value);

		if (!user) {
			const title = '';
			const message = '';
			throw new InternalServerError(title, message);
		}

		const invoiceDTO = await this.invoiceProvider.generate({
			userId: user.id.value,
			ticketId: ticket.id.value,
			priceInCents: ticket.priceInCents,
			taxInCents: 0,
			date: new Date(),
		});

		const invoice = await this.invoiceRepository.create(
			Invoice.create({
				id: UUID.create(),
				discountInCents: 0,
				invoiceNumber: InvoiceNumber.create(invoiceDTO.invoiceNumber),
				issuedAt: invoiceDTO.issuedAt,
				paymentMethod: this.paymentStrategy.method,
				ticketId: ticket.id,
				totalInCents: ticket.priceInCents,
				userId: input.userId,
				paymentProvider: this.paymentStrategy.provider,
				transactionId: input.transactionId,
				downloadURL: invoiceDTO.url,
			}),
		);

		await this.loggerProvider.info({
			message: 'Invoice Created',
			meta: { invoiceId: invoice.id.value },
		});

		const notificationService = new NotificationService(this.templateRepository);

		const message = await notificationService.getMessage('invoice', {
			userName: user.name.value,
			invoiceNumber: invoice.invoiceNumber.value,
			invoiceDownloadUrl: invoice.downloadURL,
			invoiceDate: new Intl.DateTimeFormat('pt-BR').format(invoice.issuedAt),
			invoiceAmount: new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			}).format(invoice.totalInCents),
		});

		await this.notificationsProvider.send({
			body: message.body,
			subject: message.subject,
			to: user.email.value,
		});
	}
}
