# Shipping

Every release is built once, tested on the LAN (optiplex), then promoted to
production as the exact same image. Deploys use [Kamal](https://kamal-deploy.org/).

## Environments

| | Optiplex (staging) | Production |
|---|---|---|
| Kamal config | `config/deploy.yml` + `config/deploy.optiplex.yml` | `config/deploy.yml` |
| Command | `kamal deploy -d optiplex` | `kamal deploy --skip-push` |
| Server | optiplex (LAN) | ServaRica |
| Frontend URL | http://budgetr.lan | https://budgetr-app.nurey.com |
| GraphQL API | http://budgetr-api.lan/graphql | from `VITE_GRAPHQL_URI` in `.env.production` |

Both use the image `nurey/budgetr-frontend:<git sha>`, built on optiplex
(the remote builder in `config/deploy.yml`).

### How one image serves both

The API is chosen in the browser by the host the page was loaded from
(`src/utils/graphqlUri.js`). Hosts listed there get their mapped API; any other
host, production included, falls back to the `VITE_GRAPHQL_URI` baked in at
build time. Nothing environment-specific is passed to the build, so the image
tested on optiplex is byte-for-byte what production runs.

The `.lan` names are local DNS records in pihole, declared in the homelab repo
(`stacks/pihole/docker-compose.yml`, `FTLCONF_dns_hosts`). On optiplex the
frontend and the budgetr backend share one kamal-proxy: the frontend claims
`budgetr.lan`, and the backend is the catch-all route.

## Release steps

1. **Commit everything.** Kamal builds from a clean clone of `HEAD`, so
   uncommitted changes are not shipped. Run `bun run test` first.

2. **Deploy to optiplex.** This builds the image, pushes it to Docker Hub, and
   starts it on optiplex:

   ```bash
   kamal deploy -d optiplex
   ```

3. **Test on http://budgetr.lan.** Check the page loads, its GraphQL requests
   go to `budgetr-api.lan` and succeed, and the console is clean.

4. **Promote to production.** Without making any new commit (see below):

   ```bash
   kamal deploy --skip-push
   ```

   `--skip-push` skips the build and pulls the image already pushed for
   `HEAD`'s sha.

5. **Check https://budgetr-app.nurey.com.** To confirm production runs the
   tested build, compare the bundle each site serves; the names are content
   hashes, so they match only for identical builds:

   ```bash
   for u in http://budgetr.lan/ https://budgetr-app.nurey.com/; do
     curl -s $u | grep -o 'assets/index-[^"]*\.js'
   done
   ```

## Gotchas

- **Don't commit between steps 2 and 4.** The image tag is the git sha of
  `HEAD`. A new commit changes it, and `--skip-push` then looks for an image
  that was never built. If that happens, run step 2 again.
- **Secrets live in `.kamal/secrets-common`.** With a destination (`-d optiplex`)
  Kamal reads only `secrets-common` and `secrets.<destination>`, never plain
  `.kamal/secrets`; `secrets-common` is read by both deploys.
- **Adding an environment** means a Kamal destination file, a host → API entry
  in `src/utils/graphqlUri.js`, and DNS for its hostnames.

## Rolling back

Kamal keeps the previous containers on each server:

```bash
kamal rollback <git sha>                # production
kamal rollback <git sha> -d optiplex    # optiplex
```

`kamal app containers` (add `-d optiplex` for optiplex) lists the versions
available to roll back to.
