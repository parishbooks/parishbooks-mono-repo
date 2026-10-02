import { safeNextPath } from '@/lib/auth/safe-next-path';

export type PostLoginUser = {
    email: string;
    emailVerified: boolean;
};

export type PostLoginSession = {
    activeOrganizationId?: string | null;
};

export type PostLoginOrganization = {
    id: string;
};

export type PostLoginContext = {
    user: PostLoginUser;
    session: PostLoginSession;
    organizations: PostLoginOrganization[];
    next?: string | null;
};

export type PostLoginGate = {
    id: string;
    when: (ctx: PostLoginContext) => boolean;
    path: (ctx: PostLoginContext) => string;
};

export const postLoginGates: PostLoginGate[] = [
    {
        id: 'email-verification',
        when: (ctx) => !ctx.user.emailVerified,
        path: (ctx) => `/verify-email?email=${encodeURIComponent(ctx.user.email)}`,
    },
    {
        id: 'organization-setup',
        when: (ctx) => !ctx.session.activeOrganizationId,
        path: () => '/onboarding',
    },
];

export function resolvePostLoginPath(ctx: PostLoginContext): string {
    for (const gate of postLoginGates) {
        if (gate.when(ctx)) return gate.path(ctx);
    }
    return safeNextPath(ctx.next);
}
