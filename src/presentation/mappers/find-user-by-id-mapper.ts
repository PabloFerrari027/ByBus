export class FindUserByIdMapper {
	static fromRequest(data: any) {
		return {
			id: data.id,
		};
	}

	static toResponse(user: any) {
		return { ...user.toJSON(), password: undefined };
	}
}
