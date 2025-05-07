export interface ListingParameters<T> {
	page: number;
	ordem: 'ASC' | 'DESC';
	orderBy: keyof T;
}
