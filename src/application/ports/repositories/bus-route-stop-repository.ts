import { BusRouteStop } from '@/domain/entities/bus-route-stop.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export interface BusRouteStopRepository {
	create(busRouteStop: BusRouteStop): Promise<BusRouteStop>;
	save(busRouteStop: BusRouteStop): Promise<BusRouteStop>;
	findById(id: string): Promise<BusRouteStop | null>;
	list(options?: ListingParameters<BusRouteStop>): ListingResponse<BusRouteStop>;
	remove(id: string): Promise<void>;
}
