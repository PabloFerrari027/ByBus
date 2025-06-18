export class ListUsersMapper {
	static fromRequest(data: any) {
		return {
			page: data.page,
			orderBy: data.order_by,
			ordem: data.ordem,
		};
	}

	static toResponse(data: any) {
		const users = data.users.map((user: any) => ({ ...user.toJSON(), password: undefined }));
		const pages = data.pages;
		return { users, pages };
	}
}
