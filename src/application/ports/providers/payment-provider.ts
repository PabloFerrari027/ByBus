import { ProcessPaymentDTO, PaymentResponseDTO } from '@/application/dtos/payment-dto.js';

export interface PaymentProvider {
	process(input: ProcessPaymentDTO): Promise<PaymentResponseDTO>;
}
