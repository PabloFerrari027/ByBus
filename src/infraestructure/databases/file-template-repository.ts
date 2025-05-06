import { TemplateRepository } from '@/application/ports/repositories/templates-repository.js';
import { NotificationTemplate } from '@/domain/entities/notification-template.js';
import fs from 'fs/promises';
import path from 'path';

export class FileTemplateRepository implements TemplateRepository {
	async findByKey(key: string): Promise<NotificationTemplate | null> {
		try {
			const content = await fs.readFile(
				path.join('templates', `${key.toLocaleLowerCase()}.json`),
				'utf-8',
			);
			return JSON.parse(content);
		} catch (err) {
			return null;
		}
	}
}
