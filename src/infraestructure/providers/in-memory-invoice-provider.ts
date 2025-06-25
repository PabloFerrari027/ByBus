import { InvoiceProvider } from '@/application/ports/providers/invoice-provider.js';
import { GenerateInvoiceDTO, InvoiceResponseDTO } from '@/application/dtos/invoice-dto.js';

export class InMemoryInvoiceProvider implements InvoiceProvider {
	async generate(input: GenerateInvoiceDTO): Promise<InvoiceResponseDTO> {
		return {
			invoiceNumber: 'INV-' + Math.floor(Math.random() * 100000),
			url: 'https://fake-invoice.example.com/invoice.pdf',
			issuedAt: new Date(),
		};
	}
}
