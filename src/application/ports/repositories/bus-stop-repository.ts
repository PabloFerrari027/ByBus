import { BusStop } from '@/domain/entities/bus-stop.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export interface BusStopRepository {
	create(busStop: BusStop): Promise<BusStop>;
	save(busStop: BusStop): Promise<BusStop>;
	findById(id: string): Promise<BusStop | null>;
	list(options?: ListingParameters<BusStop>): ListingResponse<BusStop>;
}
