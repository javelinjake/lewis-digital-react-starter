# Monorepo

Lewis React Platform (`lewis-react-platform`) is a pnpm workspace with Turborepo orchestration.

## Workspace layout

```txt
lewis-react-platform/
  apps/
    template/      Starter app (copy to create new apps)
  cms/
    directus/      Local Directus
  packages/
    ui/            @ld/ui — shadcn/ui components
    forms/         @ld/forms — React Hook Form + Valibot fields
    utils/         @ld/utils — pure TypeScript utilities
    react-utils/   @ld/react-utils — reusable hooks
    directus/      @ld/directus — Directus plumbing
    video/         @ld/video — synced playback; @ld/video/mux for Mux
    config-*/      Shared ESLint, TS, Vite, Vitest, Playwright config
  tooling/
    create-app/
    directus-template/
    architecture-check/
    apps/apps.config.json
```

## Creating a new app

```bash
pnpm create:app
pnpm install
pnpm --filter @ld/app-<slug> dev
```

The generator copies `apps/template`, updates package metadata, and registers the app in `tooling/apps/apps.config.json`.

## Running a single app

```bash
pnpm --filter @ld/app-template dev
```

## Versioning

Each app has its own `package.json` version. Shared library versions live in the pnpm catalog.
