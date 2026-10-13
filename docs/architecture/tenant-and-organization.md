# Tenant and organization architecture

**Canonical spec:** [../superpowers/specs/2026-10-12-tenant-organization-architecture-design.md](../superpowers/specs/2026-10-12-tenant-organization-architecture-design.md)

**Implementation plan:** [../superpowers/plans/2026-10-12-tenant-organization-architecture.md](../superpowers/plans/2026-10-12-tenant-organization-architecture.md)

**Pre-implementation checklist:** [../superpowers/plans/2026-10-12-tenant-organization-architecture-todo.md](../superpowers/plans/2026-10-12-tenant-organization-architecture-todo.md)

## Short summary

ParishBooks uses a **Supabase-style account model**:

- **Tenant** — the customer who **pays** for ParishBooks (subscription, plan limits, tenant-wide defaults).
- **Tenant account user** — the **single sign-up user** for that tenant (`tenant.ownerId`). Creates orgs and uses the **tenant dashboard**.
- **Organization** — a workspace under the tenant with its own **accounting, donations, KYC**, and org settings. **Managed by org staff.**
- **Org staff** — users with **`organization_member`** roles (admin, manager, usher, …). Sign in to **their org**; **no tenant dashboard** in v1.

There is **no `tenant_member` table in v1**; add it later if multiple people need access to billing/tenant settings.

Each organization must complete **KYC** before it is **active** (online donations/payouts).

Plan limits (number of orgs, invites, donation features) apply at the **tenant** level.

**Product decisions:** Each sign-up creates a **new tenant** with **`ownerId`**. Creating an org makes the **tenant account user** an **org admin**. That user **always** lands on the tenant dashboard after login (even with one org).

## Current code vs target

| Area          | Today                                | Target                                                       |
| ------------- | ------------------------------------ | ------------------------------------------------------------ |
| Sign-up       | Creates tenant + user                | Tenant + **`ownerId`**; orgs created later by that user only |
| Tenant access | N/A                                  | `user.id === tenant.ownerId`                                 |
| Billing       | `OrganizationProfile.planTier`, etc. | **Tenant** subscription                                      |
| KYC           | Org profile Cashfree fields          | Per-org activation gate                                      |
| Login         | `/dashboard`                         | Tenant dashboard vs **org** landing for org staff            |
| Scoping       | `organizationId` on ledger/donations | Unchanged                                                    |

When implementing features, read the full spec linked above.
