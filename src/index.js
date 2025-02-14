const target = 'https://jsd.012700.xyz/gh/Duo-Huang/cdn';
const cdnBaseUrl = 'https://cdn.huangduo.me';


export default {
	async fetch(request, env, ctx) {
		console.log(`[LOGGING FROM cdn Worker] Original request URL: ${request.url}`);

		const rewriteUrl = request.url.replace(cdnBaseUrl, target);
		console.log(`[LOGGING FROM Worker] Proxied request URL: ${rewriteUrl}`);

		const newRequest = new Request(rewriteUrl, {
			headers: {},
		});

		return fetch(newRequest);
	}

};
