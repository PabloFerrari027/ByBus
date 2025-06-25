import { Bus, Props } from '@/domain/entities/bus.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export interface BusRepository {
	create(bus: Bus): Promise<Bus>;
	save(bus: Bus): Promise<Bus>;
	findByLicensePlate(email: string): Promise<Bus | null>;
	findById(id: string): Promise<Bus | null>;
	list(options?: ListingParameters<Props>): ListingResponse<Bus>;
	listByCoordinates(
		latitude: number,
		longitude: number,
		radius: number,
		options?: ListingParameters<Props>,
	): ListingResponse<Bus>;
}
