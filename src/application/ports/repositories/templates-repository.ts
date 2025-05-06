import { NotificationTemplate } from '@/domain/entities/notification-template.js';

export interface TemplateRepository {
	findByKey(key: string): Promise<NotificationTemplate | null>;
}
