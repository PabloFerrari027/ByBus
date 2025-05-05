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

	private async processData(req: IncomingMessage): Promise<object> {
		let body = '';
		req.on('data', chunk => (body += chunk));
		await new Promise(resolve => req.on('end', () => resolve(null)));
		return JSON.parse(body);
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
			for await (const handler of matched.middlewares || []) {
				const response = await handler.execute({ body });
				if (response.next) continue;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(response.data));
				return;
			}
			const response = await matched.handler.handle({ body });
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
