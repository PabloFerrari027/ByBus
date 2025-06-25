import { GenerateInvoiceDTO, InvoiceResponseDTO } from '@/application/dtos/invoice-dto.js';

export interface InvoiceProvider {
	generate(input: GenerateInvoiceDTO): Promise<InvoiceResponseDTO>;
}
