import { LocationDTO } from '@/application/dtos/location-dto.js';

export interface TripPricingProvider {
	calculatePrice(input: {
		from: LocationDTO;
		to: LocationDTO;
		stops?: LocationDTO[];
	}): Promise<number>;
}
