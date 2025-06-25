import { TripEstimationProvider } from '@/application/ports/providers/trip-estimation-provider.js';
import { LocationDTO } from '@/application/dtos/location-dto.js';

export class InMemoryTripEstimationProvider implements TripEstimationProvider {
	private readonly averageSpeedKmH: number;
	private readonly timePerStopMin: number;

	constructor() {
		this.averageSpeedKmH = 30;
		this.timePerStopMin = 0.5;
	}

	private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const toRad = (value: number) => (value * Math.PI) / 180;

		const R = 6371;
		const dLat = toRad(lat2 - lat1);
		const dLon = toRad(lon2 - lon1);

		const a =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}

	async calculateEstimatedDuration(input: {
		currentLocation: LocationDTO;
		endLocation: LocationDTO;
		routeStops: LocationDTO[];
	}): Promise<number> {
		const { currentLocation, endLocation, routeStops } = input;
		const routePoints = [currentLocation, ...routeStops, endLocation];

		let totalDistanceKm = 0;

		for (let i = 0; i < routePoints.length - 1; i++) {
			totalDistanceKm += this.haversineDistance(
				routePoints[i].latitude,
				routePoints[i].longitude,
				routePoints[i + 1].latitude,
				routePoints[i + 1].longitude,
			);
		}

		const travelTimeMin = (totalDistanceKm / this.averageSpeedKmH) * 60;
		const stopsTimeMin = routeStops.length * this.timePerStopMin;

		return Math.ceil(travelTimeMin + stopsTimeMin);
	}
}
