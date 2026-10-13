export enum UserStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    SUSPENDED = 'suspended',
}

export enum MemberType {
    MEMBER = 'member',
    STAFF = 'staff',
}

export enum MemberRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member',
    VIEWER = 'viewer',
}

export enum MemberStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    REMOVED = 'removed',
}

export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REVOKED = 'revoked',
    EXPIRED = 'expired',
}

export enum SubscriptionStatus {
    TRIALING = 'trialing',
    ACTIVE = 'active',
    PAST_DUE = 'past_due',
    CANCELED = 'canceled',
    INCOMPLETE = 'incomplete',
    PAUSED = 'paused',
}

export enum BillingInterval {
    MONTH = 'month',
    YEAR = 'year',
}
