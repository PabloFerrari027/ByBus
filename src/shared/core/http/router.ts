import { Controller } from './controller.js';
import { Middleware } from './middleware.js';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RouteDefinition {
	method: HttpMethod;
	path: string;
	handler: Controller;
	middlewares?: Middleware[];
}

export interface Router {
	register(routes: RouteDefinition[]): void;
	listen(): void;
}
