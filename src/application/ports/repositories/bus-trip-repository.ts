import { BusTrip, Props } from '@/domain/entities/bus-trip.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export interface BusTripRepository {
	create(busTrip: BusTrip): Promise<BusTrip>;
	save(busTrip: BusTrip): Promise<BusTrip>;
	findById(id: string): Promise<BusTrip | null>;
	list(options?: ListingParameters<Props>): ListingResponse<BusTrip>;
	listByUserId(id: string, options?: ListingParameters<Props>): ListingResponse<BusTrip>;
	listByRouteId(id: string, options?: ListingParameters<Props>): ListingResponse<BusTrip>;
}
