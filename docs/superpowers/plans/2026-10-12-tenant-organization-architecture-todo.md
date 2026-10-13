# Tenant–organization architecture — pre-implementation checklist

**Spec:** [../specs/2026-10-12-tenant-organization-architecture-design.md](../specs/2026-10-12-tenant-organization-architecture-design.md)  
**Plan:** [2026-10-12-tenant-organization-architecture.md](./2026-10-12-tenant-organization-architecture.md)

**v1 model:** No `tenant_member` table. **Tenant account user** = sign-up user (`tenant.ownerId`). **Org staff** = `organization_member` only.

## Before you write code

- [ ] Read spec and implementation plan (amended 2026-10-12)
- [ ] Commit or stash unrelated work; branch e.g. `feat/tenant-org-architecture`
- [ ] Local DB up; `DATABASE_URL` set for migrations and e2e
- [ ] Choose execution: subagent per task vs single session (plan recommends subagent-driven)

---

## PR 1 — Tenant owner on sign-up

- [x] **Task 1:** Add `Tenant.ownerId`; set on sign-up in `auth.repository.ts`
- [x] Migration `1792008840000-TenantOwnerId` (add `owner_id`, backfill, FK)
- [x] E2e: sign-up asserts `owner_id` matches `userId`
- [ ] Run `pnpm --filter @parishbooks/database db:migrate` locally before e2e
- [ ] Commit: `feat(database): tenant owner_id on sign-up`

---

## PR 2 — Billing on tenant

- [ ] **Task 2:** Move `planTier`, `billingStatus`, `billingProvider` from `organization_profile` → `tenant`
- [ ] Rename/share enums (`TenantPlanTier`, etc.); grep and fix imports
- [ ] Migration backfill billing from first org profile per tenant
- [ ] Run migrations on a copy of prod-like data if you have it
- [ ] Commit: billing on tenant

---

## PR 3 — Auth routing

- [ ] **Task 3:** `membership.repository.ts` + `auth-redirect.helper.ts`
- [ ] Unit tests: tenant account user → `/tenant`; org staff → `/org/{slug}` or `/org/select`
- [ ] Replace hardcoded `/dashboard` in sign-in + email verify (`auth.controller.ts`, `verification.service.ts`)
- [ ] E2e: tenant owner → `redirectTo: '/tenant'`; update old `/dashboard` expectations
- [ ] Commit: post-auth redirect for tenant owner vs org staff

---

## PR 4 — Tenant & organization APIs

- [ ] **Task 4:** `tenant` module — `GET /api/v1/tenant` (profile + org list); wire `AppModule`
- [ ] **Task 5:** `POST /api/v1/tenant/organizations` — org + profile + owner as `admin` (tenant owner only)
- [ ] **Task 6:** `TenantOwnerGuard` / `OrgMemberGuard`; e2e org staff gets `403` on `GET /tenant`
- [ ] Regenerate OpenAPI / `@parishbooks/api-sdk` when svc serves
- [ ] E2e: `tenant-org.e2e.spec.ts` (list, create, admin row)
- [ ] Commit: tenant + org APIs + guards

---

## PR 5 — Entitlements & capabilities

- [ ] **Task 7:** `plan-entitlements.config.ts` + `entitlement.service.ts`; block 2nd org on starter
- [ ] Unit + e2e: over `maxOrganizations` → 403
- [ ] **Task 8:** `GET .../capabilities` from tenant plan + org KYC (`cashfreeVendorStatus`)
- [ ] Fix `organization-scoped.entity.ts` comment (organization-scoped, not tenant)
- [ ] Commit: billing limits + capabilities

---

## PR 6 — UI

- [ ] **Task 9:** `/tenant` page — list orgs, create org, open org
- [ ] Honor API `redirectTo` on sign-in / verify (no hardcoded `/dashboard`)
- [ ] Tenant account user always lands on `/tenant`; org staff unchanged
- [ ] Smoke: sign-up → verify → tenant dashboard → create org → open org
- [ ] Commit: tenant dashboard UI

---

## After milestone (defer)

- [ ] **Task 11:** Tenant fund templates + materialize on org create (separate plan/PR if ledger impact is large)
- [ ] **`tenant_member` table** — only when multiple people need tenant dashboard (billing admin, etc.)
- [ ] Tenant-wide events/campaigns when those tables exist
- [ ] Full `tenant_settings` table + inheritance (beyond defaults on org create)
- [ ] Link spec from `CLAUDE.md` / agent rules
- [ ] Org invite flow + org staff e2e (if not done in Task 6 helper)

---

## Definition of done (v1 architecture)

- [ ] 1 sign-up = 1 tenant + `ownerId`; no auto-org on sign-up
- [ ] Only tenant account user creates orgs; creator becomes org `admin`
- [ ] Tenant account user login → `/tenant` even with one org
- [ ] Org staff cannot hit tenant API/UI
- [ ] Plan limits on tenant; KYC gates on org capabilities
- [ ] Docs: spec/plan/todo aligned (no `tenant_member` in v1)
