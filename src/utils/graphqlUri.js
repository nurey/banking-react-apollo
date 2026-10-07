// The same image serves every deployment, so pick the API by the host the page was
// loaded from. Hosts not listed here (production, dev) use the build-time
// VITE_GRAPHQL_URI from .env.production / .env.development.
const GRAPHQL_URIS = {
  'budgetr.lan': 'http://budgetr-api.lan/graphql',
};

export function graphqlUri(hostname, fallback) {
  return GRAPHQL_URIS[hostname] ?? fallback;
}
