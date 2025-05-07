import { HttpMethod, RouteDefinition, Router } from '@/shared/core/http/router.js';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { parse } from 'url';

export class NodeRouterAdapter implements Router {
	private routes: RouteDefinition[];
	private server: Server<typeof IncomingMessage, typeof ServerResponse> | null;

	constructor() {
		this.routes = [];
		this.server = null;
	}

	listen(): void {
		this.server = createServer(async (req, res) => await this.handler(req, res, this.routes));
		this.server.listen(3000, () => console.log('HTTP server running on port 3000'));
	}

	register(routes: RouteDefinition[]): void {
		this.routes.push(...routes);
	}

	private async processData(req: IncomingMessage): Promise<Record<string, unknown>> {
		let body = '';
		req.on('data', chunk => (body += chunk));
		await new Promise(resolve => req.on('end', () => resolve(null)));
		if (!body) return {};
		return JSON.parse(body);
	}

	private parseQuery(query: Record<string, unknown>) {
		const parsed: Record<string, unknown> = {};
		for (const key in query) {
			let value = query[key];

			if (value === 'true') value = true;
			else if (value === 'false') value = false;
			else if (!isNaN(Number(value))) value = Number(value);

			parsed[key] = value;
		}
		return parsed;
	}

	async handler(req: IncomingMessage, res: ServerResponse, routes: RouteDefinition[]) {
		const method = req.method?.toLowerCase() as HttpMethod;
		const { pathname } = parse(req.url || '', true);
		const matched = routes.find(route => route.method === method && route.path === pathname);

		if (!matched) {
			res.statusCode = 404;
			res.end(JSON.stringify({ message: 'Route not found' }));
			return;
		}

		try {
			const body = await this.processData(req);
			const parsedUrl = parse(req.url || '', true);
			const query = this.parseQuery(parsedUrl.query);
			const headers = req.headers;
			for await (const handler of matched.middlewares || []) {
				const response = await handler.handle({ body, query, headers });
				if (response.next) continue;
				res.statusCode = response.status;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(response.data));
				return;
			}
			const response = await matched.handler.handle({ body, query });
			res.statusCode = response.status;
			if (response.data) {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(response.data));
			} else {
				res.end();
			}
		} catch (error) {
			res.statusCode = 400;
			return res.end(JSON.stringify({ message: 'Invalid JSON' }));
		}
	}
}
