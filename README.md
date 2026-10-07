# ParishBooks

Parish finance and operations platform for churches. This monorepo contains the NestJS API, Next.js app, and shared packages.

## Stack

- **Apps**
    - `@parishbooks/parishbooks-svc` — NestJS API (Better Auth, TypeORM, OpenAPI)
    - `@parishbooks/parishbooks-ui` — Next.js 16 App Router UI (static pages with stub content)
- **Packages**
    - `@parishbooks/iam` — Better Auth configuration and plugins
    - `@parishbooks/database` — TypeORM entities, migrations, Nest module
    - `@parishbooks/core` — shared Nest bootstrap, auth guard, logging, health
    - `@parishbooks/communications` — SMTP email delivery
    - `@parishbooks/design-system` — shared UI primitives (shadcn)
    - `@parishbooks/site-ui` — marketing/site shell components
- **Tooling** — [Nx](https://nx.dev), [Bun](https://bun.sh), TypeScript, PostgreSQL

## Prerequisites

- [Bun](https://bun.sh) (package manager and runtime)
- PostgreSQL
- SMTP credentials (for email OTP / password reset)

## Setup

1. **Clone and install**

    ```sh
    git clone https://github.com/parishbooks/parishbooks-mono-repo.git
    cd parishbooks-mono-repo
    bun install
    ```

2. **Configure environment**

    ```sh
    cp .env.example .env
    ```

    Fill in at least:

    | Variable                     | Purpose                                                                 |
    | ---------------------------- | ----------------------------------------------------------------------- |
    | `DATABASE_URL`               | PostgreSQL connection string                                            |
    | `IAM_SECRET`                 | Better Auth secret                                                      |
    | `APP_UI_URL` / `APP_SVC_URL` | Local URLs (defaults `http://localhost:3000` / `http://localhost:8000`) |
    | `SMTP_*`                     | Outbound email for OTP and password reset                               |

3. **Run database migrations**

    ```sh
    # Better Auth tables (sessions, users, organizations, …)
    bun run auth:migrate

    # App tables (organization profiles, …)
    bun run db:migrate
    ```

4. **Start the apps**

    ```sh
    bun run dev
    ```

    This serves both tagged apps in parallel:
    - UI → http://localhost:3000
    - API → http://localhost:8000
    - OpenAPI JSON → http://localhost:8000/api/docs-json
    - Swagger UI → http://localhost:8000/api/docs (if enabled by the core bootstrap)

## Common commands

| Command                                      | Description                                        |
| -------------------------------------------- | -------------------------------------------------- |
| `bun run dev`                                | Serve UI + API                                     |
| `bunx nx serve @parishbooks/parishbooks-ui`  | UI only                                            |
| `bunx nx serve @parishbooks/parishbooks-svc` | API only                                           |
| `bun run auth:migrate`                       | Apply Better Auth schema                           |
| `bun run db:migrate`                         | Apply TypeORM migrations                           |
| `bun run db:generate`                        | Generate a TypeORM migration from entity changes   |
| `bunx nx graph`                              | Visualize project dependencies                     |
| `bun run format`                             | Prettier format                                    |
| `bun run prepare`                            | Install Husky git hooks (runs after `bun install`) |

Pre-commit runs [lint-staged](https://github.com/lint-staged/lint-staged): ESLint `--fix` on staged JS/TS, then Prettier on staged JS/TS/JSON/MD/CSS.

The UI does not call the API. Dashboard, auth, and onboarding pages render local stub content.

## Project layout

```text
apps/
  parishbooks-svc/     NestJS API
  parishbooks-ui/      Next.js UI
packages/
  iam/                 Better Auth
  database/            TypeORM
  core/                Nest shared utilities
  communications/      Email
  design-system/       UI kit
  site-ui/             Site shell
e2e/                   End-to-end projects
tools/                 Generators / workspace tools
```

## Auth overview

- Email/password sign-up and sign-in with email OTP verification
- Session cookies: `pb_access_token`, `pb_refresh_token`, `pb_session_token`
- Organizations via Better Auth organization plugin; create flow activates the org and remints the access JWT
- The UI is static. Auth forms navigate between pages locally, and the dashboard reads stub organizations from `apps/parishbooks-ui/src/lib/stub/workspace.ts`
- Dashboard routes are `/dashboard/{orgSlug}/...`; switching workspaces only changes the URL

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on pushes to `main` and on pull requests targeting `main` as three sequential jobs:

- **Lint** — `nx affected -t lint`
- **Test** — `nx affected -t test`
- **Build** — `nx affected -t build`

Uses Bun and [nx affected](https://nx.dev/ci/features/affected) so only changed projects (and dependents) run.

## License

MIT
