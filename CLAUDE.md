# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AnnouncePlus is a Shopify embedded app built with Remix, React, and Prisma. It runs inside the Shopify Admin iframe using App Bridge and Polaris UI components.

**Tech stack:** Remix 2.16 + React 18 + Vite 6 + Prisma (SQLite) + TypeScript + Shopify Polaris 12

## Common Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (wraps `shopify app dev`) |
| Build | `npm run build` |
| Lint | `npm run lint` |
| DB setup/migrate | `npm run setup` |
| Prisma CLI | `npm run prisma` |
| Generate GraphQL types | `npm run graphql-codegen` |
| Deploy | `shopify app deploy` |

There are no test scripts configured.

## Architecture

### Routing (Flat File Routes)

Routes live in `app/routes/` using Remix flat route conventions:

- `app.jsx` — Authenticated layout (wraps all `/app/*` routes with AppProvider, NavMenu, Outlet)
- `app._index.jsx` — Main dashboard page
- `app.additional.jsx` — Additional settings page
- `auth.login/` — Login page
- `auth.$/` — OAuth callback handler (catch-all)
- `webhooks.*.jsx` — Webhook endpoint handlers
- `_index/` — Public landing page

All `app.*` routes require Shopify admin authentication. Public routes (`_index`, `auth.*`) do not.

### Key Server Modules

- `app/shopify.server.js` — Central Shopify app config: API key, scopes, auth strategy, session storage, webhook subscriptions. This is the single source of truth for Shopify integration.
- `app/db.server.js` — Prisma client singleton (avoids multiple instances in dev HMR).
- `app/entry.server.jsx` — SSR entry point with streaming support.

### Database

Prisma schema at `prisma/schema.prisma` with SQLite provider. Currently has a single `Session` model for OAuth session storage. Migrations in `prisma/migrations/`.

### Extensions

The `extensions/` directory is configured as a workspace and wired into `.graphqlrc.js` for GraphQL schema discovery, but currently empty. Use `shopify app generate extension` to scaffold new extensions.

### Shopify Configuration

- `shopify.app.toml` — App identity, scopes (`read_metaobjects`, `write_metaobjects`, `read_products`), webhook subscriptions, API version (2026-01)
- `shopify.web.toml` — Dev/build commands, Prisma predev hook
- Embedded auth strategy with expiring offline access tokens enabled

## Code Style

- 2-space indentation, Prettier formatting
- ESLint extends `@remix-run/eslint-config` with Prettier integration
- JSX files use `.jsx` extension (not `.tsx` despite TypeScript config)
- Global `shopify` variable is available (configured in ESLint)

## Shopify API Patterns

- Use `authenticate.admin(request)` in loaders/actions to get an authenticated admin API client
- GraphQL Admin API queries use the `admin.graphql()` method with tagged template literals
- API version is January 2025 (v2026-01)
- Webhooks are registered declaratively in `shopify.server.js` and handled by route files matching `webhooks.*.jsx`
