# Lewis React Platform

pnpm + Turborepo monorepo for Lewis Digital web apps. React, Vite, and Directus. This starter sits alongside `lewis-digital-vue-starter`. It does not share packages with the Vue or React mobile repos, and it does not use Capacitor.

`pnpm dev` starts in mock mode. Directus is optional.

## Structure

```txt
apps/           Product apps (template, then client apps)
packages/       Shared @ld/* packages
tooling/        Generators, architecture checks, Directus dev
cms/            Local Directus
docs/           Monorepo documentation
```

## Quick start

```bash
pnpm install
pnpm --filter @ld/app-template dev
```

The template signs in with `demo@lewisdigital.co.uk` / `password` while `VITE_DATA_MODE=mock`.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev servers in mock mode |
| `pnpm --filter @ld/app-template dev` | Template app |
| `pnpm review` | lint + types + unit tests + architecture check |
| `pnpm test:e2e` | Playwright against the mock template |
| `pnpm create:app` | Scaffold an app from the template |
| `pnpm directus:dev` | Start local Directus |
| `VITE_DATA_MODE=live pnpm --filter @ld/app-template build` | Production build |

Production builds fail unless `VITE_DATA_MODE=live`.

## Documentation

- [Monorepo](docs/monorepo.md)
- [Architecture](docs/architecture.md)
- [Shared packages](docs/shared-packages.md)
- [Directus](docs/directus.md)
- [Development](docs/development.md)
