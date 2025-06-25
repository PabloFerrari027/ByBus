import { BusTripPassenger } from '@/domain/entities/bus-trip-passenger.js';

export interface BusTripPassengerRepository {
	create(bus: BusTripPassenger): Promise<BusTripPassenger>;
	remove(id: string): Promise<void>;
}
