export interface GenerateInvoiceDTO {
	userId: string;
	ticketId: string;
	priceInCents: number;
	taxInCents: number;
	date: Date;
}

export interface InvoiceResponseDTO {
	invoiceNumber: string;
	url: string;
	issuedAt: Date;
}
