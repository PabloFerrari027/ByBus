import { BusTicket } from '@/domain/entities/bus-ticket.js';

export interface BusTicketRepository {
	create(busTicket: BusTicket): Promise<BusTicket>;
	save(busTicket: BusTicket): Promise<BusTicket>;
	findById(id: string): Promise<BusTicket | null>;
	remove(id: string): Promise<void>;
}
