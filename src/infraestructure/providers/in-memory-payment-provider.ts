import { PaymentProvider } from '@/application/ports/providers/payment-provider.js';
import { ProcessPaymentDTO, PaymentResponseDTO } from '@/application/dtos/payment-dto.js';

export class InMemoryPaymentProvider implements PaymentProvider {
	async process(input: ProcessPaymentDTO): Promise<PaymentResponseDTO> {
		return {
			transactionId: 'txn_' + Math.random().toString(36).substring(2),
			confirmed: true,
			confirmationDate: new Date(),
		};
	}
}
