import { LocationDTO } from '@/application/dtos/location-dto.js';

export interface TripEstimationProvider {
	calculateEstimatedDuration(input: {
		currentLocation: LocationDTO;
		endLocation: LocationDTO;
		routeStops: LocationDTO[];
	}): Promise<number>;
}
