export class FindUserByEmailMapper {
	static fromRequest(data: any) {
		return {
			email: data.email,
		};
	}

	static toResponse(user: any) {
		return { ...user.toJSON(), password: undefined };
	}
}
