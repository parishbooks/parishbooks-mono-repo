# Multi-Tenant SaaS: Entity Relationship Design (Final)

Target: PostgreSQL (Supabase-style, with Row Level Security).
Purpose: authoritative spec for agents generating schema, migrations, RLS policies, API code and tests.

## 1. Concepts

- **user**: anyone who can log in. Identity only.
- **profile**: personal info for a user (1:1 with user).
- **client**: a user who signed up to own organizations and pay. The billing tenant. A user is a client at most once.
- **plan / subscription**: what a client pays for and the limits that apply.
- **organization**: workspace owned by exactly one client. A client owns many.
- **member**: a user's access to an organization. One table covers regular members and hired staff (`type`).
- **invitation**: pending invite for an email (user may not exist yet).
- **audit_log**: append-only record of important actions.

A user may be a client, a member of many organizations (own or others'), or both.

## 2. Relationships

```
user 1 --- 1 profile
user 1 --- 0..1 client
client 1 --- 0..N subscription        (at most one live subscription)
plan 1 --- 0..N subscription
client 1 --- 0..N organization
organization 1 --- 0..N member
user 1 --- 0..N member                (unique per org)
organization 1 --- 0..N invitation
organization 1 --- 0..N audit_log
user 1 --- 0..N audit_log             (actor)
```

## 3. Enums

| Enum                | Values                                                   |
| ------------------- | -------------------------------------------------------- |
| user_status         | active, pending, suspended                               |
| member_type         | member, staff                                            |
| member_role         | owner, admin, member, viewer                             |
| member_status       | active, suspended, removed                               |
| invitation_status   | pending, accepted, revoked, expired                      |
| subscription_status | trialing, active, past_due, canceled, incomplete, paused |
| billing_interval    | month, year                                              |

## 4. Tables

Conventions: `id` is `uuid` default `gen_random_uuid()`; timestamps are `timestamptz`; every table has `created_at default now()` unless noted; emails are `citext`.

### user

| Column           | Type        | Constraints                                                        |
| ---------------- | ----------- | ------------------------------------------------------------------ |
| id               | uuid        | PK; equals the auth provider's user id (Supabase: `auth.users.id`) |
| email            | citext      | NOT NULL, UNIQUE                                                   |
| auth_provider_id | text        | UNIQUE (omit if id already equals auth id)                         |
| status           | user_status | NOT NULL default 'active'                                          |
| last_login_at    | timestamptz |                                                                    |
| deleted_at       | timestamptz | soft delete                                                        |

No password column. Credentials live in the auth provider.

### profile

| Column     | Type        | Constraints                          |
| ---------- | ----------- | ------------------------------------ |
| user_id    | uuid        | PK, FK -> user(id) ON DELETE CASCADE |
| full_name  | text        |                                      |
| phone      | text        |                                      |
| avatar_url | text        |                                      |
| timezone   | text        |                                      |
| updated_at | timestamptz |                                      |

### client

| Column              | Type        | Constraints                           |
| ------------------- | ----------- | ------------------------------------- |
| id                  | uuid        | PK                                    |
| user_id             | uuid        | NOT NULL, UNIQUE, FK -> user(id)      |
| company_name        | text        |                                       |
| billing_customer_id | text        | UNIQUE (payment provider customer id) |
| deleted_at          | timestamptz | soft delete                           |

### plan

| Column              | Type             | Constraints                                 |
| ------------------- | ---------------- | ------------------------------------------- |
| id                  | uuid             | PK                                          |
| code                | text             | NOT NULL, UNIQUE (e.g. free, pro, business) |
| name                | text             | NOT NULL                                    |
| price_cents         | integer          | NOT NULL default 0                          |
| billing_interval    | billing_interval | NOT NULL default 'month'                    |
| max_orgs            | integer          | NULL = unlimited                            |
| max_members_per_org | integer          | NULL = unlimited                            |
| max_staff_per_org   | integer          | NULL = unlimited                            |
| features            | jsonb            | NOT NULL default '{}'                       |
| billing_price_id    | text             | UNIQUE (payment provider price id)          |
| is_active           | boolean          | NOT NULL default true                       |

### subscription

| Column                  | Type                | Constraints                                  |
| ----------------------- | ------------------- | -------------------------------------------- |
| id                      | uuid                | PK                                           |
| client_id               | uuid                | NOT NULL, FK -> client(id) ON DELETE CASCADE |
| plan_id                 | uuid                | NOT NULL, FK -> plan(id)                     |
| status                  | subscription_status | NOT NULL                                     |
| current_period_start    | timestamptz         |                                              |
| current_period_end      | timestamptz         |                                              |
| cancel_at_period_end    | boolean             | NOT NULL default false                       |
| trial_ends_at           | timestamptz         |                                              |
| billing_subscription_id | text                | UNIQUE                                       |
| updated_at              | timestamptz         |                                              |

Partial unique index: one live subscription per client.
`UNIQUE (client_id) WHERE status IN ('trialing','active','past_due','paused')`.
Writes come from the billing webhook using the service role only.

### organization

| Column     | Type        | Constraints                                   |
| ---------- | ----------- | --------------------------------------------- |
| id         | uuid        | PK                                            |
| client_id  | uuid        | NOT NULL, FK -> client(id) ON DELETE RESTRICT |
| name       | text        | NOT NULL                                      |
| slug       | citext      | NOT NULL, UNIQUE                              |
| settings   | jsonb       | NOT NULL default '{}'                         |
| created_by | uuid        | FK -> user(id)                                |
| deleted_at | timestamptz | soft delete                                   |

Changing `client_id` transfers ownership of the org. Deleting a client who still owns active orgs must be blocked (RESTRICT).

### member

| Column     | Type          | Constraints                                        |
| ---------- | ------------- | -------------------------------------------------- |
| id         | uuid          | PK                                                 |
| org_id     | uuid          | NOT NULL, FK -> organization(id) ON DELETE CASCADE |
| user_id    | uuid          | NOT NULL, FK -> user(id) ON DELETE CASCADE         |
| type       | member_type   | NOT NULL default 'member'                          |
| role       | member_role   | NOT NULL default 'member'                          |
| status     | member_status | NOT NULL default 'active'                          |
| invited_by | uuid          | FK -> user(id)                                     |
| hired_by   | uuid          | FK -> user(id); staff only                         |
| starts_at  | timestamptz   | staff only                                         |
| ends_at    | timestamptz   | staff only; access ends after this                 |

Constraints:

- `UNIQUE (org_id, user_id)`.
- CHECK: `hired_by`, `starts_at`, `ends_at` are NULL when `type = 'member'`.
- CHECK: `ends_at > starts_at` when both set.
- Each org must always have at least one active `owner` (enforce in trigger or server function).

Active access means `status = 'active'` AND (`ends_at IS NULL` OR `ends_at > now()`).

### invitation

| Column      | Type              | Constraints                                        |
| ----------- | ----------------- | -------------------------------------------------- |
| id          | uuid              | PK                                                 |
| org_id      | uuid              | NOT NULL, FK -> organization(id) ON DELETE CASCADE |
| email       | citext            | NOT NULL                                           |
| type        | member_type       | NOT NULL default 'member'                          |
| role        | member_role       | NOT NULL default 'member'                          |
| token_hash  | text              | NOT NULL, UNIQUE (store hash; email the raw token) |
| status      | invitation_status | NOT NULL default 'pending'                         |
| invited_by  | uuid              | NOT NULL, FK -> user(id)                           |
| accepted_by | uuid              | FK -> user(id)                                     |
| expires_at  | timestamptz       | NOT NULL default now() + interval '2 days'         |

Partial unique index: `UNIQUE (org_id, email) WHERE status = 'pending'`.
On acceptance: create the `member` row with the invitation's `type` and `role`, set `status = 'accepted'`, set `accepted_by`, all in one transaction.

### audit_log

| Column     | Type        | Constraints                                     |
| ---------- | ----------- | ----------------------------------------------- |
| id         | bigint      | PK, generated always as identity                |
| client_id  | uuid        | FK -> client(id) ON DELETE CASCADE              |
| org_id     | uuid        | FK -> organization(id) ON DELETE CASCADE        |
| actor_id   | uuid        | FK -> user(id)                                  |
| action     | text        | NOT NULL (e.g. `member.invited`, `org.created`) |
| target     | jsonb       |                                                 |
| created_at | timestamptz | NOT NULL default now()                          |

Append-only. No UPDATE or DELETE policies.

## 5. Indexes

- Index every foreign key column.
- `member (user_id)` for "my organizations".
- `member (org_id) WHERE status = 'active'`.
- `organization (client_id)`.
- `audit_log (org_id, created_at DESC)`.
- Partial unique indexes as listed under subscription and invitation.

## 6. Business rules to enforce

1. **Org limit:** before inserting an organization, count the client's non-deleted orgs and compare with the live subscription's `plan.max_orgs`. Reject if reached. Implement as a BEFORE INSERT trigger.
2. **Member and staff limits:** same pattern against `max_members_per_org` and `max_staff_per_org`, counted by `type` among active members.
3. **Org creator:** when an org is created, insert the creator as a `member` with `role = 'owner'`, `type = 'member'`.
4. **Owner invariant:** an org must keep at least one active owner. Block removing or demoting the last one.
5. **Staff expiry:** staff access ends automatically when `ends_at` passes. Access checks must include the time condition, no cron required.
6. **Client deletion:** blocked while the client owns non-deleted organizations. Use soft delete.
7. **Invitations:** expire after `expires_at`. Mark expired lazily or via scheduled job. Never accept an expired or revoked invite.
8. **Audit:** write an audit_log row for org create/delete, member invite/accept/remove/role change, ownership transfer and plan change.

## 7. Row Level Security (every table: ENABLE RLS)

Helper functions (SECURITY DEFINER, `set search_path = public`, STABLE) to avoid recursive policies:

- `is_org_member(org uuid) -> boolean`: active access per section 4 for `auth.uid()`.
- `has_org_role(org uuid, roles member_role[]) -> boolean`: same check plus role in list.
- `is_client_owner(client uuid) -> boolean`: `client.user_id = auth.uid()`.

Policies:

| Table        | Operation            | Rule                                                           |
| ------------ | -------------------- | -------------------------------------------------------------- |
| user         | all                  | `id = auth.uid()`                                              |
| profile      | all                  | `user_id = auth.uid()`                                         |
| client       | all                  | `user_id = auth.uid()`                                         |
| plan         | select               | all authenticated users                                        |
| subscription | select               | `is_client_owner(client_id)`; writes via service role only     |
| organization | select               | `is_org_member(id)` or `is_client_owner(client_id)`            |
| organization | insert               | `is_client_owner(client_id)`                                   |
| organization | update               | `has_org_role(id, {owner, admin})`                             |
| member       | select               | `is_org_member(org_id)`                                        |
| member       | insert/update/delete | `has_org_role(org_id, {owner, admin})`                         |
| invitation   | all                  | `has_org_role(org_id, {owner, admin})`                         |
| audit_log    | select               | `has_org_role(org_id, {owner, admin})`; insert via server only |

## 8. Pattern for future tenant-scoped tables

Every domain table (projects, content, etc.) must:

1. Have `org_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE`.
2. Have an index on `org_id`.
3. Enable RLS with a policy: `USING (is_org_member(org_id))`, adding `has_org_role` for write operations that need elevated roles.

Never trust an `org_id` sent by the client for authorization. Always derive access from membership.

## 9. Notes for implementers

- Naming: tables are singular snake_case (`user`, `member`). `user` is a reserved word in Postgres, so quote it (`"user"`) or use a prefix such as `app_user`. In Supabase, prefer keeping auth in `auth.users` and using `profile` as the public mirror, with `user` represented by `auth.users`.
- Stripe (or other billing) is the source of truth for subscription state. Sync through webhooks.
- Use a transaction for any multi-row operation (create org + owner membership, accept invitation).
- Keep `type` (how the person relates to the org) separate from `role` (what they may do). Permissions derive from `role` only.
- Out of scope for this design: custom roles/permission tables, SSO/SAML, per-org billing, usage metering.
