import { InternalServerError } from '@/domain/errors/internal-server-error.js';
import { TemplateRepository } from '../ports/repositories/templates-repository.js';

type TemplateKey = 'WELCOME' | 'PASSWORD-CHANGE';

export class NotificationService {
	constructor(private readonly templateRepo: TemplateRepository) {}

	async getMessage(templateKey: TemplateKey, variables: Record<string, string>) {
		const template = await this.templateRepo.findByKey(templateKey);
		if (!template) {
			throw new InternalServerError(
				'Template not found',
				`Template with key ${templateKey} is not found`,
			);
		}

		const replace = (text: string) =>
			text.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] || '');

		return {
			subject: replace(template.subject),
			body: replace(template.body),
		};
	}
}
