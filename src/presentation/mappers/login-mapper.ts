export class LoginMapper {
	static fromRequest(data: any) {
		return {
			name: data.name,
			email: data.email,
			password: data.password,
			authProvider: data.auth_provider,
		};
	}

	static toResponse(data: any) {
		const user = { ...data.user.toJSON(), password: undefined };
		const session = {
			...data.session.toJSON(),
			access_token: data.accessToken.toJSON(),
		};
		return { user, session };
	}
}
