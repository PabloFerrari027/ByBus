export type ListingResponse<Entity> = Promise<{
	data: Array<Entity>;
	pages: number;
}>;
