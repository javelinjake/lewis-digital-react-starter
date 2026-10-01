# Lewis Digital Monorepo Rules

This is a pnpm + Turborepo monorepo of React/Directus web apps and shared packages.

Default to app-local changes.

Files inside packages/\* are live shared code.

Apps own features, routes, pages, nav, themes, which data mode they run, Directus schemas, and product copy.

Shared packages own reusable UI, utilities, React hooks, form fields, Directus plumbing, and video playback.

shadcn/ui source in `@ld/ui` is the only UI layer. Do not build a second component kit, and do not copy components into `src/components/ui`.

TanStack Query is server state. Zustand is session status and UI state. Zustand must not persist credentials.

Import direction is pages/routes → features → shared packages.

`pnpm dev` runs in mock mode without Directus. Production builds require `VITE_DATA_MODE=live` and must not fall back to mocks.

Do not store auth tokens in `localStorage`. Web auth uses session cookies. Mock mode keeps the session in memory.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.

<!-- END:turborepo-agent-rules -->
