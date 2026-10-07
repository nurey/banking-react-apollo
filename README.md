# banking-react-apollo

A React + Apollo Client banking UI, built with [Vite](https://vite.dev/) and managed with [Bun](https://bun.sh/).

## Prerequisites

- [Bun](https://bun.sh/) (this project is standardized on Bun — do not use npm or yarn)

Install dependencies:

```bash
bun install
```

## Available Scripts

### `bun run dev`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
The page reloads automatically when you make edits.

Pass `--host` to expose the dev server on your local network:

```bash
bun run dev --host
```

### `bun run test`

Runs the test suite once with [Vitest](https://vitest.dev/).

### `bun run build`

Builds the app for production to the `dist` folder, minified and with hashed filenames.

### `bun run preview`

Serves the production build locally to preview it before deploying.

## Shipping

Releases are tested on optiplex, then the same image is promoted to production:

```bash
kamal deploy -d optiplex    # build, push, deploy to http://budgetr.lan
kamal deploy --skip-push    # promote that image to production
```

See [doc/shipping.md](doc/shipping.md) for the full process.

## Learn More

- [Vite documentation](https://vite.dev/)
- [Apollo Client documentation](https://www.apollographql.com/docs/react/)
- [React documentation](https://react.dev/)
