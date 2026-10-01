# Directus

## Frontend environment variables

```txt
VITE_DATA_MODE=mock
VITE_DIRECTUS_URL=http://localhost:8055
VITE_FRONTEND_URL=http://localhost:5173
```

`mock` uses in-memory feature APIs. `live` uses Directus. These values are visible in the browser. Do not store secrets in frontend env variables.

Development treats an unset `VITE_DATA_MODE` as `mock`. Production (`vite build`, and the built app) requires `live` and throws otherwise.

Session cookies are managed by Directus. There is no cookie configuration on the frontend.

## Client setup

The typed client lives in `src/lib/directus/client.ts` and is only constructed in live mode:

```ts
createDirectus<Schema>(url)
  .with(authentication('session', { credentials: 'include' }))
  .with(rest({ credentials: 'include' }))
```

## Auth flow

1. App bootstrap calls `refresh()` to restore the session cookie
2. `readCurrentUser()` loads `/users/me`
3. Login, refresh, and logout use session mode
4. Route guards handle UX redirects, not security

Mock mode uses `demo@lewisdigital.co.uk` / `password` and keeps that session in memory.

## Local Directus

```bash
pnpm directus:dev
```

This starts Docker Compose in `cms/directus` on port 8055. It does not switch the app to live mode. Copy `apps/template/.env.example` to `apps/template/.env.local` and set `VITE_DATA_MODE=live`.

The template notes API expects a `notes` collection:

| Field | Type |
|-------|------|
| `title` | string |
| `body` | text |

`id`, `date_created`, and `date_updated` are Directus defaults. Give the app user read and create permission on `notes`.

CORS for local development:

```txt
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true
```

## Schema generation

```bash
pnpm --filter @ld/app-template generate:types
```

Reads `VITE_DIRECTUS_URL` and `DIRECTUS_TOKEN` from `.env.local`. Use a static admin token. Never commit it.

Output: `src/schemas/directus-schema.ts`

## Where API calls should live

| Location | Use |
|----------|-----|
| `src/features/<feature>/api/` | Feature API, with `mock.ts` and `directus.ts` |
| `src/lib/directus/` | Shared client |
| `src/lib/auth/` | Session API used at bootstrap |

Never call the Directus SDK from a `.tsx` component.
