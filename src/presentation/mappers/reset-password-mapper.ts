export class ResetPasswordMapper {
	static fromRequest(body: any) {
		return {
			userId: body.user_id,
			newPassword: body.new_password,
		};
	}

	static toResponse(bus: any) {
		return bus.toJSON();
	}
}
