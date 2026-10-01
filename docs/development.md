# Development

## Local setup

```bash
pnpm install
pnpm --filter @ld/app-template dev
```

The template runs at `http://localhost:5173` in mock mode. No Docker is required.

## Live Directus

```bash
pnpm directus:dev
cp apps/template/.env.example apps/template/.env.local
```

Set `VITE_DATA_MODE=live` in `.env.local`, create the `notes` collection, then restart the app. See [directus.md](directus.md).

## Commands

| Command                                    | Purpose                                           |
| ------------------------------------------ | ------------------------------------------------- |
| `pnpm dev`                                 | Dev servers (turbo)                               |
| `pnpm --filter @ld/app-template dev`       | Template app                                      |
| `pnpm build`                               | Production builds. Requires `VITE_DATA_MODE=live` |
| `pnpm lint` / `pnpm ts` / `pnpm test:unit` | Quality checks                                    |
| `pnpm review`                              | lint + ts + test:unit + architecture:check        |
| `pnpm create:app`                          | Scaffold a new app from the template              |
| `pnpm directus:dev`                        | Start local Directus                              |
| `pnpm directus:dev -- down`                | Stop local Directus                               |

## Checks

Push to `main` and pull requests run lint, types, unit tests, the architecture check, and a production build. A weekly audit reports dependency vulnerabilities. Deploy is manual and does not publish anything yet. Every workflow is `contents: read` and does not use secrets.

## Adding a feature

Create under `apps/<app>/src/features/example/`:

```txt
api/          types, mock.ts, directus.ts, index.ts
queries/
mutations/
components/
forms/
types/
```

`api/index.ts` returns the mock or Directus implementation from `getEnvConfig().VITE_DATA_MODE`. Query hooks call that object.

## Production

Set these in the host environment before `vite build`:

```txt
VITE_DATA_MODE=live
VITE_DIRECTUS_URL=https://api.example.com
VITE_FRONTEND_URL=https://app.example.com
```

A missing or non-live mode fails the build. The running app checks again and will not start on mocks.
