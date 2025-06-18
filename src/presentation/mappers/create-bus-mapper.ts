export class CreateBusMapper {
	static fromRequest(body: any) {
		return {
			licensePlate: body.license_plate,
		};
	}

	static toResponse(bus: any) {
		return bus.toJSON();
	}
}
