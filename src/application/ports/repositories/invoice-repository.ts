import { Invoice } from '@/domain/entities/invoice.js';

export interface InvoiceRepository {
	create(invoice: Invoice): Promise<Invoice>;
	save(invoice: Invoice): Promise<Invoice>;
	findById(id: string): Promise<Invoice | null>;
	remove(id: string): Promise<void>;
}
