import { Driver, Props } from '@/domain/entities/driver.js';
import { ListingParameters } from '@/shared/types/listing-parameters.js';
import { ListingResponse } from '@/shared/types/listing-response.js';

export interface DriverRepository {
	create(driver: Driver): Promise<Driver>;
	save(driver: Driver): Promise<Driver>;
	findById(id: string): Promise<Driver | null>;
	list(options?: ListingParameters<Props>): ListingResponse<Driver>;
}
