# Local Directus

```bash
pnpm directus:dev
pnpm directus:dev -- down
```

Studio: http://localhost:8055

The values in `.env.example` are for this machine only. `pnpm directus:dev` copies them to `.env` on first run. Change `KEY`, `SECRET`, and `ADMIN_TOKEN` if the instance is reachable beyond localhost.

Create a `notes` collection with `title` (string) and `body` (text) before using `VITE_DATA_MODE=live`. See [docs/directus.md](../../docs/directus.md).
