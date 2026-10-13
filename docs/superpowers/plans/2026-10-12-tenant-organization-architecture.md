# Tenant–organization architecture implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align ParishBooks with a Supabase-style model where each sign-up creates a paying **tenant**, organizations are created under that tenant with separate books/KYC, and login routing separates **tenant dashboard** access from **org-only** members.

**Architecture:** Evolve existing `tenant` + `organization` entities (approach A in spec): set **`tenant.ownerId`** at sign-up (no `tenant_member` in v1), move subscription fields from `organization_profile` to `tenant`, wire signup + post-auth redirects, add `tenant` and `organization` Nest modules with owner vs org-staff guards, then entitlements/KYC capabilities and UI routes.

**Amended:** 2026-10-12 — dropped `tenant_member`; tenant account user only creates orgs; org staff via `organization_member` only. Tenant FK: entity **`ownerId`**, column **`owner_id`**.

**Tech stack:** Nx monorepo, NestJS 11, TypeORM 0.3, PostgreSQL, Vitest (unit + e2e), Next.js UI (`parishbooks-ui`), `@parishbooks/api-sdk` from OpenAPI.

**Spec:** [../specs/2026-10-12-tenant-organization-architecture-design.md](../specs/2026-10-12-tenant-organization-architecture-design.md)

## Global constraints

- **1 sign-up = 1 new tenant**; sign-up creates `User` + `Tenant` with **`ownerId = user.id`** and **does not** auto-create an organization.
- **Org create:** only **`tenant.ownerId`** may create orgs; that user gets `organization_member` role **`admin`** in the same DB transaction.
- **Tenant account user** always lands on **`/tenant`** after sign-in/email-verify (even with exactly one org).
- **Org staff** (`user.id !== tenant.ownerId`, with `organization_member` rows) **must not** access tenant API routes or tenant UI.
- **v1:** one email → one tenant; no cross-tenant membership.
- Ledger/donations remain **`organizationId`**-scoped; billing/plan limits on **tenant**.
- Run DB changes via `packages/database` scripts: `pnpm --filter @parishbooks/database db:generate`, `db:migrate`.
- Run tasks through Nx: `pnpm nx run @parishbooks/parishbooks-svc:build`, `pnpm nx run @parishbooks/parishbooks-svc-e2e:e2e`.
- Match existing auth patterns: cookies `pb_access_token` / `pb_refresh_token`, `AuthUser` DTO, CLS `tenantId` in `auth.service.ts`.

## Review focus

| Risk                                      | Expected behavior                     | Test owner                                   |
| ----------------------------------------- | ------------------------------------- | -------------------------------------------- |
| Org staff calls tenant API                | `403` with stable error code          | Task 6 e2e                                   |
| Tenant owner sign-in with one org         | `redirectTo: '/tenant'`, not org slug | Task 3 e2e                                   |
| Org create over plan `maxOrganizations`   | `403` / capability denied             | Task 7 e2e                                   |
| Online donation when org KYC not `active` | Blocked via capabilities guard        | Task 8 unit + e2e when donation route exists |
| Org staff in two orgs                     | `redirectTo: '/org/select'`           | Task 3 e2e                                   |

---

## File map (planned)

| Area             | Create / modify                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| DB entities      | extend `tenant.entity.ts` (`ownerId`, billing columns), shared billing enums                                             |
| DB migration     | `packages/database/src/lib/migrations/*-TenantOwnerAndBillingOnTenant.ts`                                                |
| DB registry      | `packages/database/src/lib/typeorm.config.ts`, `entities/index.ts`                                                       |
| Auth signup      | `apps/parishbooks-svc/src/modules/auth/repository/auth.repository.ts`                                                    |
| Auth redirect    | `apps/parishbooks-svc/src/modules/auth/helpers/auth-redirect.helper.ts`, `auth.controller.ts`, `verification.service.ts` |
| Membership load  | `apps/parishbooks-svc/src/modules/auth/repository/membership.repository.ts` (org memberships + resolve tenant owner)     |
| Tenant API       | `apps/parishbooks-svc/src/modules/tenant/*`                                                                              |
| Organization API | `apps/parishbooks-svc/src/modules/organization/*`                                                                        |
| RBAC             | `apps/parishbooks-svc/src/modules/access/*` — `TenantOwnerGuard`, `OrgMemberGuard`                                       |
| Entitlements     | `apps/parishbooks-svc/src/modules/billing/plan-entitlements.ts`                                                          |
| Capabilities     | `apps/parishbooks-svc/src/modules/organization/organization-capabilities.service.ts`                                     |
| App wiring       | `apps/parishbooks-svc/src/modules/app.module.ts`                                                                         |
| UI               | `apps/parishbooks-ui/src/app/tenant/**`, redirect handling in sign-in/verify flows                                       |
| E2e              | `e2e/parishbooks-svc-e2e/src/auth/auth.e2e.spec.ts`, new `tenant-org.e2e.spec.ts`                                        |
| Docs             | `docs/architecture/tenant-and-organization.md` (link plan), entity comment fixes                                         |

---

### Task 1: `Tenant.ownerId` + sign-up wiring

**Files:**

- Modify: `packages/database/src/lib/entities/tenant.entity.ts` (`ownerId` FK to `user`, nullable false after backfill)
- Modify: `apps/parishbooks-svc/src/modules/auth/repository/auth.repository.ts`
- Test: `e2e/parishbooks-svc-e2e/src/auth/auth.e2e.spec.ts`

**Interfaces:**

- Produces: `Tenant.ownerId: string`
- Produces: `createUserAccount` sets `ownerId` after user insert (same transaction)

- [ ] **Step 1: Add column on `Tenant`**

```typescript
@Column({ type: 'uuid' })
ownerId!: string;

@ManyToOne(() => User)
@JoinColumn({ name: 'owner_id' })
owner!: User;
```

- [ ] **Step 2: E2e helper** `e2e/parishbooks-svc-e2e/src/support/tenant-owner-e2e.helper.ts`

```typescript
export async function expectTenantOwnerUser(databaseUrl: string, tenantId: string, userId: string) {
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    const { rows } = await client.query(`SELECT owner_id FROM tenant WHERE id = $1`, [tenantId]);
    await client.end();
    expect(rows[0]?.owner_id).toBe(userId);
}
```

- [ ] **Step 3: Update `createUserAccount`** — save tenant with `ownerId: user.id` (create user first, then tenant, or update tenant after user save)

- [ ] **Step 4: Generate + run migration; e2e sign-up asserts `expectTenantOwnerUser`**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(database): tenant ownerId; set on sign-up"
```

---

### Task 2: Move billing fields from organization profile to tenant

**Files:**

- Modify: `packages/database/src/lib/entities/tenant.entity.ts`
- Modify: `packages/database/src/lib/entities/organization-profile.entity.ts` (remove `planTier`, `billingStatus`, `billingProvider`; keep KYC/Cashfree)
- Create: shared enums e.g. `packages/database/src/lib/entities/tenant-billing.enums.ts` (move/rename from `OrganizationPlanTier` → `TenantPlanTier` with re-export alias during transition if needed)
- Modify: any imports in codebase (grep `OrganizationPlanTier`, `OrganizationBillingStatus`)
- Test: migration data backfill script inside migration `up()`

**Interfaces:**

- Produces: `Tenant.planTier`, `Tenant.billingStatus`, `Tenant.billingProvider` columns
- Consumes: existing org profile rows for backfill

- [ ] **Step 1: Add columns to `Tenant`**

```typescript
@Column({ type: 'enum', enum: TenantPlanTier, default: TenantPlanTier.STARTER })
planTier!: TenantPlanTier;

@Column({ type: 'enum', enum: TenantBillingStatus, default: TenantBillingStatus.ACTIVE })
billingStatus!: TenantBillingStatus;

@Column({ type: 'enum', enum: TenantBillingProvider, nullable: true })
billingProvider?: TenantBillingProvider;
```

- [ ] **Step 2: Remove billing columns from `OrganizationProfile`**

- [ ] **Step 3: Migration `up()` backfill**

For each tenant: set billing from **first** organization profile under that tenant (if any); else defaults.

- [ ] **Step 4: Grep and fix TypeScript references**

Run: `rg "OrganizationPlanTier|OrganizationBillingStatus|OrganizationBillingProvider" apps packages`

- [ ] **Step 5: Generate + run migration; commit**

```bash
git commit -m "feat(database): move subscription billing from org profile to tenant"
```

---

### Task 3: Post-auth redirect resolver (`/tenant` vs org)

**Files:**

- Create: `apps/parishbooks-svc/src/modules/auth/helpers/auth-redirect.helper.ts`
- Create: `apps/parishbooks-svc/src/modules/auth/repository/membership.repository.ts`
- Modify: `apps/parishbooks-svc/src/modules/auth/auth.controller.ts` (sign-in, email verify)
- Modify: `apps/parishbooks-svc/src/modules/auth/services/verification.service.ts` (verify success redirect)
- Test: `e2e/parishbooks-svc-e2e/src/tenant-org/tenant-org.e2e.spec.ts` (new)

**Interfaces:**

- Produces: `resolvePostAuthRedirect(userId: string): Promise<string>`
- Logic:
    - If `user.id === tenant.ownerId` → `'/tenant'`
    - Else if exactly one `organization_member` → `'/org/' + slug` (or keep `/dashboard/{slug}` until UI Task 10)
    - Else if multiple org memberships → `'/org/select'`
    - Else → error / invite pending (org staff should always have ≥1 org membership)

```typescript
// membership.repository.ts
async isTenantAccountUser(userId: string, tenantId: string): Promise<boolean>
async listOrgMemberships(userId: string): Promise<Array<{ organizationId: string; slug: string; role: string }>>
```

- [ ] **Step 1: Unit test redirect helper**

Create: `apps/parishbooks-svc/src/modules/auth/helpers/auth-redirect.helper.spec.ts`

```typescript
import { describe, expect, it } from 'vitest';
import { resolvePostAuthRedirect } from './auth-redirect.helper';

describe('resolvePostAuthRedirect', () => {
    it('returns /tenant when user is tenant account user', () => {
        expect(
            resolvePostAuthRedirect({
                isTenantAccountUser: true,
                orgMemberships: [{ slug: 'grace-church' }],
            }),
        ).toBe('/tenant');
    });

    it('returns org path for org staff with one org', () => {
        expect(
            resolvePostAuthRedirect({
                isTenantAccountUser: false,
                orgMemberships: [{ slug: 'grace-church' }],
            }),
        ).toBe('/org/grace-church');
    });
});
```

- [ ] **Step 2: Run unit test — FAIL**

Run: `pnpm nx run @parishbooks/parishbooks-svc:test -- --testPathPattern=auth-redirect`

- [ ] **Step 3: Implement helper + repository; inject into sign-in/verify**

Replace hardcoded `redirectTo: '/dashboard'` in `auth.controller.ts` lines returning `SignInResponseDto`.

- [ ] **Step 4: E2e — tenant owner verified sign-in**

```typescript
it('tenant owner sign-in redirects to /tenant', async () => {
    const { signIn } = await AuthE2eSupport.createVerifiedSession({ label: 'tenant-owner' });
    expect(signIn.redirectTo).toBe('/tenant');
});
```

Update existing tests expecting `/dashboard`.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(auth): resolve post-auth redirect for tenant owner vs org staff"
```

---

### Task 4: Tenant module (list orgs, profile)

**Files:**

- Create: `apps/parishbooks-svc/src/modules/tenant/tenant.module.ts`, `tenant.controller.ts`, `tenant.service.ts`, `repository/tenant.repository.ts`
- Create DTOs: `tenant-response.dto.ts`, `tenant-organization-summary.dto.ts`
- Modify: `apps/parishbooks-svc/src/modules/app.module.ts`
- Test: `e2e/parishbooks-svc-e2e/src/tenant-org/tenant-org.e2e.spec.ts`

**Interfaces:**

- `GET /api/v1/tenant` — tenant billing summary + `{ organizations: { id, name, slug, kycStatus }[] }`
- Guard: `TenantOwnerGuard` (`user.id === tenant.ownerId` for `user.tenantId`)

- [ ] **Step 1: E2e failing test**

```typescript
it('GET /tenant returns org list for tenant owner', async () => {
    const { agent } = await AuthE2eSupport.createVerifiedSession({ label: 'tenant-get' });
    const res = await agent.get('/api/v1/tenant').expect(200);
    expect(res.body).toMatchObject({ tenantId: expect.any(String), organizations: expect.any(Array) });
});
```

- [ ] **Step 2: Implement module + register in `AppModule`**

- [ ] **Step 3: OpenAPI — regen api-sdk when svc serves**

Document command in commit message; run `node apps/parishbooks-svc/dist/main.js` if needed per prior project practice.

- [ ] **Step 4: E2e pass; commit**

```bash
git commit -m "feat(tenant): add tenant dashboard API for owners"
```

---

### Task 5: Organization create API (+ owner as org admin)

**Files:**

- Create: `apps/parishbooks-svc/src/modules/organization/organization.module.ts`, `organization.controller.ts`, `organization.service.ts`, `repository/organization.repository.ts`
- Create: `dto/create-organization.dto.ts` (`name`, optional `slug` or auto from name via existing `apps/parishbooks-ui/src/lib/utils/slug.ts` logic ported to shared util)
- Modify: `apps/parishbooks-svc/src/modules/app.module.ts`

**Interfaces:**

- `POST /api/v1/tenant/organizations` body `{ name: string; legalName: string; timezone: string }`
- Transaction: `organization` + `organization_profile` (defaults from tenant where applicable) + `organization_member(userId=caller, role='admin')`
- Produces: `OrganizationResponseDto { id, name, slug }`

- [ ] **Step 1: E2e test**

```typescript
it('creates organization and adds tenant owner as admin', async () => {
    const { agent, userId, tenantId } = await AuthE2eSupport.createVerifiedSession({ label: 'org-create' });
    const created = await agent
        .post('/api/v1/tenant/organizations')
        .send({ name: 'Grace Church', legalName: 'Grace Church Trust', timezone: 'Asia/Kolkata' })
        .expect(201);
    expect(created.body.slug).toMatch(/grace/);
    await expectOrgAdmin(process.env.DATABASE_URL!, userId, created.body.id);
});
```

- [ ] **Step 2: Implement service + repository**

Use `Organization`, `OrganizationProfile`, `OrganizationMember`, `CashfreeVendorStatus.NOT_STARTED`.

- [ ] **Step 3: E2e pass; commit**

```bash
git commit -m "feat(organization): create org under tenant with owner as admin"
```

---

### Task 6: Access guards (tenant owner vs org staff)

**Files:**

- Create: `apps/parishbooks-svc/src/modules/access/guards/tenant-owner.guard.ts`, `org-member.guard.ts`
- Create: `apps/parishbooks-svc/src/modules/access/decorators/require-tenant-owner.decorator.ts`
- Apply guards on `TenantController` vs org-scoped controllers

**Interfaces:**

- `TenantOwnerGuard`: `user.id === tenant.ownerId`; sets CLS `isTenantAccountUser=true`
- Org routes: `organization_member` row **or** tenant owner with org admin membership when operating in that org

- [ ] **Step 1: E2e org staff fixture**

Add `AuthE2eSupport.createOrgStaffUser()` — user with `organization_member` on an org, **`user.id !== tenant.ownerId`** (seed via SQL or minimal invite API).

- [ ] **Step 2: E2e assert `GET /tenant` → 403 for org staff**

- [ ] **Step 3: Implement guards; commit**

```bash
git commit -m "feat(access): enforce tenant vs org-only API access"
```

---

### Task 7: Plan entitlements on tenant

**Files:**

- Create: `apps/parishbooks-svc/src/modules/billing/plan-entitlements.config.ts`
- Create: `apps/parishbooks-svc/src/modules/billing/entitlement.service.ts`
- Modify: `organization.service.ts` org create — call `assertCanCreateOrganization(tenantId)`

**Interfaces:**

```typescript
export type PlanEntitlements = {
    maxOrganizations: number;
    maxOrgMembersPerOrg: number;
    onlineDonations: boolean;
    manualDonations: boolean;
};

export function getEntitlements(planTier: TenantPlanTier): PlanEntitlements;
export async function assertCanCreateOrganization(tenantId: string): Promise<void>; // throws ForbiddenException
```

- [ ] **Step 1: Unit test entitlements**

`apps/parishbooks-svc/src/modules/billing/entitlement.service.spec.ts` — starter `maxOrganizations: 1`, second create throws.

- [ ] **Step 2: Wire into org create**

- [ ] **Step 3: E2e — second org on starter plan → 403**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(billing): enforce tenant plan org limits"
```

---

### Task 8: Organization capabilities (KYC + plan)

**Files:**

- Create: `apps/parishbooks-svc/src/modules/organization/organization-capabilities.service.ts`
- Create: `dto/organization-capabilities.dto.ts` (mirror UI `organization-capabilities.ts`)
- Endpoint: `GET /api/v1/organizations/:organizationId/capabilities`
- Modify: `packages/database/src/lib/entities/organization-scoped.entity.ts` comment → organization-scoped

**Interfaces:**

- Map `cashfreeVendorStatus` → verification summary
- `canCollectOnlineDonations` = tenant entitlement `onlineDonations` && org KYC `active`
- Unit test matrix in `organization-capabilities.service.spec.ts`

- [ ] **Step 1: Unit tests for KYC inactive → flags false**

- [ ] **Step 2: Implement service + route with `OrgMemberGuard`**

- [ ] **Step 3: E2e fetch capabilities for draft org**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(organization): expose capabilities from tenant plan and org KYC"
```

---

### Task 9: UI tenant dashboard and routes

**Files:**

- Create: `apps/parishbooks-ui/src/app/tenant/page.tsx`, `layout.tsx`, `create-organization/` flow
- Modify: sign-in / verify-email consumers to use API `redirectTo` (not hardcoded `/dashboard`)
- Modify: `apps/parishbooks-ui/src/app/dashboard/page.tsx` → redirect tenant owners to `/tenant` or deprecate
- Optional: alias `/org/[slug]` → reuse existing `dashboard/[orgSlug]` pages first to reduce churn

**Interfaces:**

- Consumes: `@parishbooks/api-sdk` tenant + org create endpoints after regen

- [ ] **Step 1: Tenant page lists orgs from API**

- [ ] **Step 2: “Open org” navigates to `/dashboard/{slug}` (interim) or `/org/{slug}`**

- [ ] **Step 3: Manual smoke: sign-up → verify → lands `/tenant` → create org → open org**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(ui): tenant dashboard and post-auth redirects"
```

---

### Task 10: Data migration for existing rows

**Files:**

- Extend Task 1/2 migration: set `tenant.owner_id` from legacy sign-up user (one user per tenant)

- [ ] **Step 1: SQL in migration**

```sql
UPDATE tenant t
SET owner_id = u.id
FROM "user" u
WHERE u.tenant_id = t.id
  AND t.owner_id IS NULL;
```

(Adjust if multiple users per tenant exist in legacy data—pick earliest `created_at` user or document manual fix.)

- [ ] **Step 2: Run migration; commit**

```bash
git commit -m "chore(database): backfill tenant owner_id for existing tenants"
```

---

### Task 11 (Phase 4 — follow-up plan slice): Tenant fund templates

**Scope note:** Events/campaigns tables may not exist yet. This task only adds **fund template** columns + materialize on org create.

**Files:**

- Modify: `packages/database/src/lib/entities/fund.entity.ts` — optional `templateId`, nullable `organizationId` for templates **or** separate `fund_template` entity (prefer separate entity to avoid nullable org on ledger FK)
- Create: `fund-template.entity.ts` with `tenantId`, materialize in org create

Defer detailed steps to a **second plan file** if fund entity changes touch ledger migrations heavily; stop after Tasks 1–10 for first shippable milestone.

---

## Spec coverage checklist

| Spec section                      | Task(s)                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Tenant billing                    | 2, 7                                                                                                 |
| Tenant owner (`ownerId`)          | 1, 10                                                                                                |
| Org create + admin                | 5                                                                                                    |
| Sign-in routing                   | 3                                                                                                    |
| Tenant dashboard API/UI           | 4, 9                                                                                                 |
| Org staff access denial on tenant | 6                                                                                                    |
| KYC per org / capabilities        | 8                                                                                                    |
| Settings inheritance              | Partial — use tenant defaults on org profile create in Task 5; full `tenant_settings` table deferred |
| Events/campaigns templates        | Task 11 / follow-up                                                                                  |
| Migration                         | 2, 10                                                                                                |

## Plan self-review

- Placeholder scan: none.
- Types: `TenantPlanTier` used consistently after Task 2 rename.
- Review focus: all five rows mapped to Tasks 3, 6, 7, 8.
- Scope: Tasks 1–10 = **Phase 1–3** shippable; Task 11 explicitly deferred/split.

---

## Suggested PR sequence

1. PR1: Task 1 (`ownerId` + sign-up) + Task 10 backfill if needed
2. PR2: Task 2 (billing on tenant)
3. PR3: Tasks 3–6 (redirect + tenant/org API + guards)
4. PR4: Tasks 7–8 (entitlements + capabilities)
5. PR5: Task 9 (UI)
