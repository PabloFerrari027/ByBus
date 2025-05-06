import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { FileTemplateRepository } from '../databases/file-template-repository.js';

type Implementation = 'FILE';

let provider: TemplateRepository;

export function MakeTamplateRepository(implementation: Implementation) {
	switch (implementation) {
		case 'FILE':
			if (provider instanceof FileTemplateRepository) return provider;
			provider = new FileTemplateRepository();
			break;
		default:
			break;
	}

	return provider;
}
