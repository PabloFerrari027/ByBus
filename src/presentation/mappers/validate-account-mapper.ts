export class ValidateAccountMapper {
	static fromRequest(data: any) {
		return {
			code: data.code,
			userId: data.user_id,
		};
	}

	static toResponse(data: any) {
		return null;
	}
}
