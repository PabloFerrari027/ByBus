export interface ProcessPaymentDTO {
	userId: string;
	amountInCents: number;
	paymentMethod: 'credit_card' | 'pix' | 'boleto';
	metadata?: Record<string, unknown>;
}

export interface PaymentResponseDTO {
	transactionId: string;
	confirmed: boolean;
	confirmationDate?: Date;
}
