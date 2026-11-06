export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Proxy API and Actuator requests to the Spring Boot VPS
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/actuator')) {
      const backendUrl = new URL(url.pathname + url.search, 'https://api.cutletspring.com');
      const newHeaders = new Headers(request.headers);
      newHeaders.set('host', 'api.cutletspring.com');
      newHeaders.set('x-forwarded-host', url.host);
      newHeaders.set('x-forwarded-proto', url.protocol.replace(':', ''));

      const proxyRequest = new Request(backendUrl.toString(), {
        method: request.method,
        headers: newHeaders,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow',
      });

      return fetch(proxyRequest);
    }

    // Serve static assets for the React SPA
    return env.ASSETS.fetch(request);
  },
};

