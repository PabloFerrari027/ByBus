import { BusRepository } from '@/application/ports/repositories/bus-repository.js';
import { Bus } from '@/domain/entities/bus.js';
import { Email } from '@/domain/value-objects/email.js';
import { LicensePlate } from '@/domain/value-objects/license-plate.js';
import { Name } from '@/domain/value-objects/name.js';
import { UUID } from '@/domain/value-objects/uuid.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export class InMemoryBusRepository implements BusRepository {
	private items: Bus[];

	constructor() {
		this.items = [];
	}

	private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

		const earthRadiusKm = 6371;
		const deltaLatitude = degreesToRadians(lat2 - lat1);
		const deltaLongitude = degreesToRadians(lon2 - lon1);

		const a =
			Math.sin(deltaLatitude / 2) ** 2 +
			Math.cos(degreesToRadians(lat1)) *
				Math.cos(degreesToRadians(lat2)) *
				Math.sin(deltaLongitude / 2) ** 2;

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return earthRadiusKm * c;
	}

	private sort(a: Bus, b: Bus, orderBy: keyof Bus, ordem: 'ASC' | 'DESC'): number {
		const valorA = a[orderBy];
		const valorB = b[orderBy];

		if (valorA instanceof Date && valorB instanceof Date) {
			return ordem === 'ASC'
				? valorA.getTime() - valorB.getTime()
				: valorB.getTime() - valorA.getTime();
		}

		if (valorA instanceof UUID && valorB instanceof UUID) {
			return ordem === 'ASC'
				? valorA.value.localeCompare(valorB.value)
				: valorB.value.localeCompare(valorA.value);
		}

		if (valorA instanceof Name && valorB instanceof Name) {
			return ordem === 'ASC'
				? valorA.value.localeCompare(valorB.value)
				: valorB.value.localeCompare(valorA.value);
		}

		if (valorA instanceof Email && valorB instanceof Email) {
			return ordem === 'ASC'
				? valorA.value.localeCompare(valorB.value)
				: valorB.value.localeCompare(valorA.value);
		}

		return 0;
	}

	async create(bus: Bus): Promise<Bus> {
		this.items.push(bus);
		return bus;
	}

	async save(bus: Bus): Promise<Bus> {
		this.items = this.items.map(u => (u.id.equals(bus.id) ? bus : u));
		return bus;
	}

	async findByLicensePlate(value: string): Promise<Bus | null> {
		return (
			this.items.find(bus => LicensePlate.compare(bus.licensePlate, LicensePlate.create(value))) ||
			null
		);
	}

	async findById(id: string): Promise<Bus | null> {
		return this.items.find(bus => UUID.compare(bus.id, UUID.create(id))) || null;
	}

	async list(options?: ListingParameters<Bus>): ListingResponse<Bus> {
		const page = options?.page ?? 1;
		const ordem = options?.ordem ?? 'DESC';
		const orderBy = options?.orderBy ?? 'createdAt';

		const start = (page - 1) * 100;
		const end = start + 100;

		const pages = Math.ceil(this.items.length / 100);
		const data = this.items.slice(start, end).sort((a, b) => this.sort(a, b, orderBy, ordem));

		return { data, pages };
	}

	async listByCoordinates(
		latitude: number,
		longitude: number,
		radius: number,
		options?: ListingParameters<Bus>,
	): ListingResponse<Bus> {
		const page = options?.page ?? 1;
		const ordem = options?.ordem ?? 'DESC';
		const orderBy = options?.orderBy ?? 'createdAt';

		const start = (page - 1) * 100;
		const end = start + 100;

		const radiusInKm = radius;

		const nearbyBuses = this.items.slice(start, end).filter(bus => {
			const busLoc = bus.location;
			const distance = this.haversineDistance(
				latitude,
				longitude,
				busLoc.latitude,
				busLoc.longitude,
			);
			return distance <= radiusInKm;
		});

		const pages = Math.ceil(nearbyBuses.length / 100);
		const data = nearbyBuses.sort((a, b) => this.sort(a, b, orderBy, ordem));

		return { data, pages };
	}
}
