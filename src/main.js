const targets = ['https://cdn.jsdelivr.net/gh/Duo-Huang/cdn', 'https://jsd.012700.xyz/gh/Duo-Huang/cdn'];
const cdnBaseUrl = 'https://cdn.huangduo.me';

export default {
	async fetch(request, env, ctx) {
		console.log(`[CDN Worker] Original URL: ${request.url}`);

		let response;
		for (const target of targets) {
			const newUrl = request.url.replace(cdnBaseUrl, target);
			console.log(`[Worker] Trying to request: ${newUrl}`);

			// 复制并处理请求头
			const headers = new Headers(request.headers);
			headers.delete('Host'); // 自动生成正确的Host头

			try {
				const newRequest = new Request(newUrl, {
					method: request.method,
					headers: headers,
					body: request.body,
					redirect: 'follow',
				});

				response = await fetch(newRequest);

				if (response.ok) {
					// 复制响应头并添加CORS支持
					const responseHeaders = new Headers(response.headers);
					responseHeaders.set('Access-Control-Allow-Origin', '*');

					return new Response(response.body, {
						status: response.status,
						headers: responseHeaders,
					});
				}
				console.log(`[Worker] Request failed: ${newUrl} (Status Code: ${response.status})`);
			} catch (error) {
				console.error(`[Worker] Request failed: ${newUrl}`, error.message);
			}
		}

		// 所有CDN都不可用时返回错误
		return new Response('The CDN service is temporarily unavailable. Please try again later', {
			status: 503,
			headers: { 'Content-Type': 'text/plain' },
		});
	},
};
