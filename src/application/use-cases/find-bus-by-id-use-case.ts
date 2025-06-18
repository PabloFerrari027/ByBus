import { Either, right } from '@/shared/types/either.js';
import { BusRepository } from '@/application/ports/repositories/bus-repository.js';
import { Bus } from '@/domain/entities/bus.js';

interface Right {
	bus: Bus | null;
}

type Left = void;

type Output = Promise<Either<Left, Right>>;

interface Input {
	busId: string;
}

export class FindBusByIdUseCase {
	constructor(private readonly busRepository: BusRepository) {}

	async execute(input: Input): Output {
		const bus = await this.busRepository.findById(input.busId);
		return right({ bus });
	}
}
