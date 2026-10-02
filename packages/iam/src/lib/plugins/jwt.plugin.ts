import { jwt } from 'better-auth/plugins';

export class JwtPlugin {
    public static init() {
        return jwt({
            jwt: {
                expirationTime: '15m',
                definePayload: ({ user, session }) => ({
                    sessionId: session.id,
                    sessionToken: session.token,
                    userId: user.id,
                    email: user.email,
                    name: user.name,
                    emailVerified: user.emailVerified,
                    organizationId: session.activeOrganizationId,
                }),
            },
        });
    }
}
