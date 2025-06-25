import { BusStop, Props } from '@/domain/entities/bus-stop.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export interface BusStopRepository {
	create(busStop: BusStop): Promise<BusStop>;
	save(busStop: BusStop): Promise<BusStop>;
	findById(id: string): Promise<BusStop | null>;
	list(options?: ListingParameters<BusStop>): ListingResponse<Props>;
	listByRouteId(routeId: string, options?: ListingParameters<Props>): ListingResponse<BusStop>;
	listByCoordinates(
		latitude: number,
		longitude: number,
		radius: number,
		options?: ListingParameters<Props>,
	): ListingResponse<BusStop>;
}
