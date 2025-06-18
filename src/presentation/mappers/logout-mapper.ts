export class LogoutMapper {
	static fromRequest(data: any) {
		return {
			sessionId: data.session_id,
		};
	}

	static toResponse(data: any) {
		return null;
	}
}
