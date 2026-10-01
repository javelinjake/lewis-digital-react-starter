# Shared packages

| Package           | Responsibility                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `@ld/ui`          | shadcn/ui primitives, toast, and the token CSS                                                       |
| `@ld/forms`       | React Hook Form + Valibot fields, plus a dirty-form flag                                             |
| `@ld/react-utils` | Theme and pagination hooks                                                                           |
| `@ld/directus`    | Directus client, errors, pagination                                                                  |
| `@ld/utils`       | Framework-free helpers                                                                               |
| `@ld/video`       | Synced playback: provider, HTML surface, transport, and seek bar. `@ld/video/mux` is the Mux surface |
| `@ld/config-*`    | ESLint, TypeScript, Vite, Vitest, Playwright                                                         |

`@ld/ui` ships `globals.css`. Each app imports it and overrides CSS variables in its own theme file.

Add shadcn components from the UI package, not from an app:

```bash
pnpm dlx shadcn@latest add dialog -c packages/ui
```

`components.json` in `packages/ui` is the registry config. Apps must not grow a `src/components/ui` folder.

Schemas stay in the app. `@ld/forms` does not know about Directus collections.
