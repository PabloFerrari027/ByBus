export type PaymentMethod = 'CREDIT_CARD' | 'PIX' | 'DEBIT_CARD';
export type PaymentProvider = 'PIX';

export interface PaymentStrategy {
	readonly method: PaymentMethod;
	readonly provider: PaymentProvider;
	processPayment(input: {
		amountInCents: number;
		userId: string;
	}): Promise<{ success: boolean; transactionId: string }>;
}
