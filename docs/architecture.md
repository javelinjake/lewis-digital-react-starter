# Architecture

Feature-first apps. Shared mechanisms live in `packages/*`.

## Routing

Data router only: `createBrowserRouter` and `RouterProvider`. Nested layouts are the shells (`app`, `auth`). Route `handle` carries `title`. The app header reads it with `useMatches`.

Do not add route loaders or actions for API data. Reads and writes go through TanStack Query. Auth guards are layout components that read Zustand session status.

## Data

Each feature exposes one API, for example `notesApi.list()` and `notesApi.create()`, returning application-owned types.

- The mock implementation uses seeded fixtures. Tests can pass a delay, an error, or an empty list.
- The Directus implementation uses `@ld/directus` and maps CMS records into those same types.
- The app selects the implementation at startup from `VITE_DATA_MODE`.

Components and query hooks call that API. They do not import the Directus SDK.

Dev defaults to `mock` when `VITE_DATA_MODE` is unset. Any other unknown value throws. A production build and a production runtime require `VITE_DATA_MODE=live`.

## Boundaries

`pages` and `routes` may import features. Features may not import each other. Shared folders may not import features or pages.

`@ld/ui` does not import React Hook Form, TanStack Query, Zustand, or Directus. Form fields live in `@ld/forms`.

Pages should stay small. The architecture check enforces 500 lines.
