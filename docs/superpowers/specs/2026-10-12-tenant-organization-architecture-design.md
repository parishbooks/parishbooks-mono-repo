# Design: Tenant–organization architecture (ParishBooks SaaS)

**Status:** Approved (2026-10-12), amended same day — no `tenant_member` in v1; tenant FK column **`owner_id`** (not `owner_user_id`)  
**Date:** 2026-10-12  
**Replaces:** Implicit “flat organization = everything” model; supersedes diocese/branch hierarchy discussions until a later ADR.

---

## Problem

The current data model and product flow do not match how ParishBooks should be sold or operated:

- Sign-up creates **one `tenant` per user email**, with no distinction between the **paying SaaS customer** and **staff at a parish org**.
- **`Organization`** combines parish workspace, accounting boundary, billing (`OrganizationProfile.planTier`), and KYC—without a clear **tenant-level subscription**.
- There is **no tenant dashboard**, no plan-gated **org creation / invites / donations**, and no **login routing** (tenant owner vs org-only roles).
- Code comments and stubs reference specs that are not in the repo; domain language is inconsistent (`OrganizationScopedEntity` comments say “tenant-scoped” but columns are `organizationId`).

We need a **Supabase-like account model**: one **tenant** (customer) pays for ParishBooks; the tenant creates **organizations**; each org has its own books, donations, members, and KYC; configuration can be **tenant-wide defaults** or **per-org overrides**.

---

## Goals (success criteria)

1. **Billing:** Subscription and plan limits apply to the **tenant**, not each organization row.
2. **Isolation:** Each **organization** has its own ledger, funds, donations, and org settings.
3. **Access:** The **tenant account user** uses a **tenant dashboard** (list orgs, create org, tenant settings). **Org staff** (admin, manager, usher, etc.) land in **their org** after login and **cannot** open the tenant dashboard.
4. **Activation:** Each org completes **KYC independently** before the org is **active** (donations/payouts as gated capabilities).
5. **Configuration:** **Events, campaigns, funds** (and similar) can be defined **once at tenant level** and applied to all orgs, or **only within one org**.
6. **Entitlements:** Org count, member invites, donation features, etc. are enforced from the **tenant’s subscribed plan**.

---

## Non-goals (this design)

- Diocese / parish / **branch tree** hierarchy (sibling orgs under one tenant only).
- **One user, multiple paying tenants** (e.g. consultant on two ParishBooks accounts)—out of scope for v1; each **new sign-up creates a new tenant** (see Decisions).
- Full Stripe/Cashfree implementation detail (interfaces and gates only).
- **`tenant_member` table or extra tenant-level roles** (billing admin, co-owner)—defer until we need more than one person on the paying account.

---

## Domain glossary

| Term                                | Meaning                                                                                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**                            | Person with credentials (email/password).                                                                                                                        |
| **Tenant**                          | ParishBooks **customer account** that **pays the subscription**. Owns zero or more organizations.                                                                |
| **Tenant account user**             | The **single paying user** for the tenant (created at sign-up). Identified by **`tenant.ownerId`**. Creates orgs and uses the **tenant dashboard**.              |
| **Organization (org)**              | A parish/unit workspace under a tenant: **own accounting, donations, members, KYC, org settings**. **Managed day-to-day by org staff.**                          |
| **Organization member (org staff)** | User linked to an org with **org roles** (admin, manager, usher, member, …). Invited to an org under the tenant; **must not** access the tenant dashboard in v1. |
| **Org active**                      | Org has passed **KYC** (and any other gates) and may use gated capabilities.                                                                                     |
| **Tenant settings**                 | Defaults and **global** resources (events, campaigns, fund templates) that apply to all orgs unless overridden.                                                  |
| **Org settings**                    | Overrides and org-specific resources.                                                                                                                            |

---

## Proposed architecture (recommended)

### High-level structure

```
Tenant (subscription, plan, billing, tenant settings)
 ├── Organization A (ledger, donations, KYC, members, org settings)
 ├── Organization B
 └── Organization C
```

**Users** in v1:

- **Tenant account user** — one per tenant (sign-up); tenant dashboard; **only this user creates organizations**.
- **Org staff** — `organization_member` only; org app (or org picker if multiple orgs). No tenant dashboard.
- **Tenant account user + org admin** — after creating an org, the account user is also **`organization_member` (admin)** for that org; **sign-in always lands on tenant dashboard** first (including when the tenant has only one org). Enter an org via explicit switch from the tenant dashboard (see Auth).

### Three approaches considered

| Approach                                     | Summary                                                                                                                                                                                                        | Trade-off                                                                               |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **A. Evolve current entities (recommended)** | Keep `tenant` + `organization`; set **`tenant.ownerId`** at sign-up (no `tenant_member` in v1); move billing fields from `organization_profile` to `tenant`; orgs created only by tenant account user via API. | Simple RBAC; add `tenant_member` later if multiple people need tenant dashboard access. |
| **B. Rename Tenant → Account**               | Same as A but rename table/entity for product language.                                                                                                                                                        | Clearer for docs/UI; migration + API breaking change.                                   |
| **C. New BillingAccount table**              | Tenant stays technical; separate `billing_account` for subscription.                                                                                                                                           | Extra entity; only worth it if tenant is purely technical partition.                    |

**Recommendation:** **A** for v1. Document “Tenant = Supabase organization / paying account” in glossary and UI copy.

---

## Data model

### Tenant (extend)

**Purpose:** Subscription, plan entitlements, tenant-wide defaults.

**New / moved fields (from org profile where appropriate):**

- `ownerId` — FK to `user.id` (DB column **`owner_id`** via snake naming); the **tenant account user** (set at sign-up)
- `planTier`, `billingStatus`, `billingProvider`, subscription ids (provider-specific columns later)
- Optional: `settings` JSON or normalized `tenant_settings` table for defaults pushed to orgs

**Existing:** `name`, `status` (`active`, `suspended`, …)

**Rules:**

- **One sign-up → one new tenant.** Each registration creates a distinct paying account; there is no “join existing tenant” at sign-up in v1.
- **Only `ownerId` may create organizations** and call tenant-scoped APIs in v1.
- **Suspended** tenant: read-only or block per product policy.

**Sign-up:** Create `User`, `Tenant` with `ownerId = user.id`. **Do not** auto-create an organization.

### Organization (keep, clarify)

**Purpose:** Accounting and donations boundary; org membership; per-org KYC.

- `tenantId` (unchanged)
- `name`, `slug` (unique per tenant)
- **Remove** ParishBooks subscription fields from `OrganizationProfile` (move to tenant)
- **Keep** org legal/compliance: legal name, country, timezone, currency, fiscal year, tax ids, **Cashfree vendor / KYC fields**, `fcraRegistered`, etc.

**Org create (transaction):**

1. Create `organization` (+ profile) under the tenant (subject to plan `maxOrganizations`).
2. Create **`organization_member`** for **`tenant.ownerId`** with role **`admin`**.

Only the tenant account user may run org create; they become org admin without a separate invite.

### OrganizationMember (extend)

- Replace free-text `role` with enum: `admin`, `manager`, `usher`, `member`, …
- Optional: `invitedAt`, `invitedBy`, status `pending|active`

**Rule:** Users where **`user.id !== tenant.ownerId`** (org staff) **cannot** call tenant APIs or see tenant dashboard routes, even if `user.tenantId` matches the org’s tenant for data scoping.

### OrganizationScopedEntity (unchanged column name)

Ledger, `fund`, `donation`, `journal_*`, `receipt`, etc. remain scoped by **`organizationId`**.

Rename comment/docs to **“organization-scoped”** (not tenant-scoped).

### KYC and org lifecycle

| State         | Meaning                                                  |
| ------------- | -------------------------------------------------------- |
| `draft`       | Created, settings incomplete                             |
| `pending_kyc` | Submitted, awaiting provider                             |
| `active`      | KYC approved; donations/payouts allowed per capabilities |
| `rejected`    | KYC failed; `rejectionReason`                            |
| `suspended`   | Tenant or compliance action                              |

Store on **`organization_profile`** (or `organization.status` + profile detail). **Each org** must reach `active` independently.

### Plan entitlements (tenant-level)

Enforce on tenant, examples:

| Entitlement           | Example limit       |
| --------------------- | ------------------- |
| `maxOrganizations`    | Starter: 1, Pro: 10 |
| `maxOrgMembersPerOrg` | Per plan            |
| `onlineDonations`     | Boolean             |
| `manualDonations`     | Boolean             |
| `invitesPerMonth`     | Rate limit          |

Implementation: `tenant.planTier` + policy service reading plan config (static JSON or table). APIs return `403` + `CAPABILITY_DENIED` / `BILLING_LOCKED` when exceeded.

### Events, campaigns, funds (configuration)

**Two layers:**

1. **Tenant templates** — `tenantId` set, `organizationId` null → “apply to all orgs” or “available to clone.”
2. **Org instances** — `organizationId` set → org-specific.

**Fund behavior:**

- **Tenant-defined fund template:** On org create (or sync job), optionally **materialize** org-local `fund` rows linked to `templateId`, or resolve at runtime (prefer **materialized** funds for ledger integrity and FCRA flags per org).
- **Org-only fund:** Created only under that org.

Same pattern for **events** and **campaigns** (tables may be future; spec the pattern now).

**Settings inheritance:**

- `tenant_settings` defaults (timezone, fiscal year, language, …)
- `organization_profile` overrides nullable fields; resolution: `org.field ?? tenant.default.field`

---

## Auth and session

### Sign-up

1. Create **new** user + **new** tenant with **`ownerId = user.id`** (always a fresh tenant; never attach sign-up to an existing tenant).
2. Send email verification (existing flow).
3. Redirect to **tenant dashboard** (empty state: “Create your first organization”).

### Sign-in routing (after credentials + email verified)

Evaluate in order:

1. If user is **tenant account user** (`user.id === tenant.ownerId`) → **always** land on **`/tenant`**, including when the tenant has **exactly one** org. Do not auto-skip to the org app on login.
2. Else if user has **exactly one** org membership → redirect to **`/org/{slug}`** (org home).
3. Else if **multiple** org memberships → **`/org/select`** (org picker only, no tenant nav).
4. Else → error / invite pending state.

**Hard rule:** Org-only users **must not** access tenant routes (guard on API + UI).

### Request context (CLS / JWT)

Minimum claims or session fields:

- `userId`
- `tenantId` — user’s tenant (from `user.tenantId`)
- `isTenantAccountUser` — `user.id === tenant.ownerId` (or resolve server-side)
- `organizationId` — active org when operating inside an org
- `orgRoles[]` (or load server-side per request)

**Org switch:** Tenant owner picks org from tenant dashboard → set `organizationId` cookie/header → org routes.

---

## API surface (conceptual)

| Area         | Prefix / notes                                                               |
| ------------ | ---------------------------------------------------------------------------- |
| Auth         | Existing `/auth/*`                                                           |
| Tenant       | `/tenant` — profile, billing, settings, list/create orgs                     |
| Organization | `/orgs/{orgId}` or `/org/{slug}` — ledger, donations, members, org settings  |
| Capabilities | `/orgs/{id}/capabilities` — KYC status, plan gates (extend stub in UI types) |

OpenAPI and `@parishbooks/api-sdk` regen after implementation milestones.

---

## UI routes (conceptual)

| Route                  | Audience                                                                  |
| ---------------------- | ------------------------------------------------------------------------- |
| `/tenant`              | Tenant account user: org list, create org, subscription, global templates |
| `/tenant/settings`     | Tenant defaults for orgs                                                  |
| `/org/{slug}`          | Org members + tenant owners when switched into org                        |
| `/org/{slug}/settings` | Org overrides                                                             |
| `/sign-in`, `/sign-up` | Public                                                                    |

Remove or repurpose flat **`/dashboard/[orgSlug]`** only after migration plan (likely `/org/{slug}` equivalent).

---

## Migration from current schema

1. **Billing fields:** Move `planTier`, `billingStatus`, `billingProvider` from `organization_profile` → `tenant` (or new `tenant_billing` 1:1).
2. **Existing users:** Each legacy tenant-from-signup → set **`tenant.ownerId`** to the sign-up user for that tenant (one user per tenant in legacy data).
3. **Orphan tenants:** Tenants with user but no org — valid state (tenant dashboard empty).
4. **Auth:** **`user.tenantId`** remains the tenant scope for queries; **tenant dashboard access** uses **`tenant.ownerId`**. Org staff share `tenantId` but are not owners.
5. **Comments / stubs:** Update `organization-capabilities`, workspace stub, and entity comments to match this doc.

Phased rollout:

- **Phase 1:** Schema (`ownerId`, billing on tenant) + signup/sign-in routing + tenant dashboard shell.
- **Phase 2:** Plan entitlements + org create limits.
- **Phase 3:** KYC gates per org; move verification off conflated flags.
- **Phase 4:** Tenant templates for funds/events/campaigns.

---

## Testing strategy

- **Unit:** Entitlement policy from `planTier`; settings inheritance resolver.
- **E2e:** Sign-up → tenant owner → create org (owner is org admin) → tenant owner login lands on tenant dashboard → org-only invite → login routes to org not tenant; KYC inactive blocks donation endpoint.
- **Migration:** Fixture DB with old shape → migration script → assert `ownerId` set and billing on tenant.

---

## Trade-offs and risks

| Risk                                         | Mitigation                                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Multiple people on tenant dashboard later    | Add **`tenant_member`** (or roles) when billing admins are needed; until then only **`ownerId`**. |
| Tenant templates vs ledger                   | Materialize org funds from templates; don’t post journals to “template” rows.                     |
| Org-only user invited to second org          | Org picker; still no tenant dashboard.                                                            |
| Legacy `getUserByEmail` without tenant scope | Scope lookups by tenant when multi-tenant users arrive in v2.                                     |

---

## Decisions (product)

| Topic                         | Decision                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sign-up and tenants           | **1 sign-up = 1 new tenant.** Every new registration creates a new ParishBooks customer account.                                                                       |
| Org create                    | The **tenant owner** (creator) is automatically **`organization_member` with role `admin`**.                                                                           |
| Login with one org            | **Tenant account user always sees the tenant dashboard** after login, even if the tenant has only one organization. Org work starts via “open org” from the dashboard. |
| Multi-tenant users            | **v1:** one email maps to at most one tenant (via sign-up). Cross-tenant membership deferred.                                                                          |
| Tenant-level membership table | **Not in v1.** Only the sign-up user (`ownerId`) uses the tenant dashboard and creates orgs. **Org staff** are **`organization_member`** only.                         |

---

## Related documentation

- This file is the **source of truth** for tenant/org architecture until ADRs split billing or hierarchy.
- Implementation plans should be generated via **writing-plans** after this spec is approved.
- Update `CLAUDE.md` / agent rules with a link to this spec when implementing auth or database changes.

---

## Approval

Review this spec. When approved, next step is an **implementation plan** (phased PRs: schema → auth routing → tenant UI → entitlements → KYC gates → templates).
