# Auth flow × ER design — alignment checklist

**Spec:** [ER_DESIGN.md](./ER_DESIGN.md)  
**Context:** Entities and auth were refactored off the legacy tenant/account model (`new-system-design`). Sign-up/sign-in still use interim local credentials and API DTOs shaped for the old flow.

**Already aligned (no action unless regressing):**

- Sign-up creates `user` + `profile` + `client` in one transaction.
- Sign-in validates password via interim `verification` row `credential:{userId}`.
- Email OTP uses separate verification identifiers; success sets `user.status` → `active`.
- `tenantId` removed from sign-up response, JWT CLS, and related e2e.

---

## P0 — Blockers (runtime / security)

- [ ] **Database migration:** Add migration(s) matching current entities (`user_status`, `profile`, `client`, `plan`, `subscription`, `organization`, `member`, `invitation`, `audit_log`, `citext`, enums). Drop or migrate off legacy `tenant`, `account`, old `user` columns. Run locally before e2e.
- [ ] **`AuthUser` mapping bug:** Replace `new AuthUser({ ...user, roles: [] })` with `toAuthUser(user)` in `auth.controller.ts` (email-verification verify) and `auth.service.ts` (`validateJwtPayload`). Spreading `User` leaves `emailVerified` undefined and breaks post-verify sign-in and JWT guards.
- [ ] **Email normalization:** Normalize email (trim + lowercase) on sign-up, sign-in, and all repository lookups (`checkUserExists`, `getUserByEmail`, `createUserAccount`) to match OTP/password-reset paths.

---

## P1 — ERD semantics & data integrity

- [ ] **`user.status` semantics:** Document and enforce meaning of `active` / `suspended` / `deleted`. Today `suspended` = unverified at sign-up; ERD also uses `suspended` for admin action — split or document conflation.
- [ ] **`auth_provider_id`:** Set when integrating Supabase (or other provider); align `user.id` with provider id if required by spec.
- [ ] **`last_login_at`:** Update on successful sign-in and email-verify sign-in.
- [ ] **Soft-deleted users:** Ensure sign-in / sign-up / password-reset respect `deleted_at` and `UserStatus.DELETED` consistently (TypeORM soft-delete + explicit status checks).
- [ ] **Admin suspend / ban:** Replace removed `banned*` columns with `UserStatus.SUSPENDED` (or dedicated flow); wire `toAuthUser` / `validateUser` and API errors accordingly.

---

## P2 — Auth architecture (interim → target)

- [ ] **Credentials:** Move off `verification` credential rows to auth provider (ERD: no password on `user`). Remove `credential:{userId}` helper when provider owns passwords.
- [ ] **`verification` table:** Keep for OTP/challenges only, or rename/document as non-ERD app table.
- [ ] **Sign-up variants:** Owner path creates `client` (current). Add invite-only member sign-up that creates `user` + `profile` **without** `client` when accepting invitations.
- [ ] **Profile fields:** Map optional sign-up `phone` (schema) → `profile.phone`; consider splitting `full_name` vs display name in API if needed.
- [ ] **User entity relations:** Resolve duplicate profile loading — either ORM `relations: { profile: true }` on `User` or manual load in `auth.repository`, not both; avoid circular entity imports.

---

## P3 — Product & billing (post-auth)

- [ ] **Plan / subscription:** Seed default plan; create trial/free `subscription` for new `client` on sign-up if product requires org limits per ER §6.
- [ ] **Post-auth redirect:** Replace hardcoded `redirectTo: '/dashboard'` with membership/client routing (e.g. client home vs org slug / org select) per architecture plans.
- [ ] **JWT / `AuthUser` DTO:** Decide long-term shape — keep `emailVerified` / `username` for API/SDK vs ERD-native fields; populate `roles` from `member.role` when org context exists.
- [ ] **Audit log:** Write `audit_log` rows for sign-up, email verified, sign-in (optional), password reset per ER §6 / §8.

---

## P4 — Tests & docs

- [ ] **E2e:** Run auth suite after migration; update redirect expectations when routing changes.
- [ ] **OpenAPI / api-sdk:** Regenerate after DTO changes (`SignUpResponseDto`, `AuthUser`, etc.).
- [ ] **Deprecate stale docs:** Mark or update [tenant-organization-architecture-todo](../superpowers/plans/2026-10-12-tenant-organization-architecture-todo.md) where it assumes `tenant` / `owner_id`.

---

## Flow verification matrix (after P0)

| Step                                   | Expected                                 | Verify              |
| -------------------------------------- | ---------------------------------------- | ------------------- |
| POST `/auth/sign-up`                   | user + profile + client + credential row | DB + 201            |
| POST `/auth/sign-in` (unverified)      | 403, redirect to verify email            | e2e                 |
| POST `/auth/email-verification/verify` | ACTIVE + cookies; no false “unverified”  | e2e + fix P0 mapper |
| POST `/auth/sign-in` (verified)        | 200 + cookies                            | e2e                 |
| JWT-protected request                  | Validates user still ACTIVE              | e2e / manual        |
| POST `/auth/password-reset/confirm`    | Updates credential hash                  | e2e                 |
