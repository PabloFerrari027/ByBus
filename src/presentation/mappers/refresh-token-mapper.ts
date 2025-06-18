export class RefreshTokenMapper {
	static fromRequest(data: any) {
		return {
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
		};
	}

	static toResponse(data: any) {
		return { accessToken: data.accessToken.toJSON(), refreshToken: data.refreshToken.toJSON() };
	}
}
