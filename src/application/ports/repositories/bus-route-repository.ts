import { BusRoute } from '@/domain/entities/bus-route.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export interface BusRouteRepository {
	create(busRoute: BusRoute): Promise<BusRoute>;
	save(busRoute: BusRoute): Promise<BusRoute>;
	findById(id: string): Promise<BusRoute | null>;
	list(options?: ListingParameters<BusRoute>): ListingResponse<BusRoute>;
}
