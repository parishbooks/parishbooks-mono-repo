import { resolvePostLoginPath, type PostLoginContext } from './post-login-destination';

function ctx(partial: Partial<PostLoginContext> & Pick<PostLoginContext, 'user'>): PostLoginContext {
    return {
        session: {},
        organizations: [],
        ...partial,
    };
}

describe('resolvePostLoginPath', () => {
    it('sends unverified users to email verification', () => {
        expect(
            resolvePostLoginPath(
                ctx({
                    user: { email: 'jane@parishbook.com', emailVerified: false },
                    organizations: [{ id: 'org_1' }],
                    session: { activeOrganizationId: 'org_1' },
                }),
            ),
        ).toBe('/verify-email?email=jane%40parishbook.com');
    });

    it('sends users with no organizations to onboarding', () => {
        expect(
            resolvePostLoginPath(
                ctx({
                    user: { email: 'jane@parishbook.com', emailVerified: true },
                    organizations: [],
                    session: {},
                }),
            ),
        ).toBe('/onboarding');
    });

    it('sends users with an organization to the dashboard even without an active organization id', () => {
        expect(
            resolvePostLoginPath(
                ctx({
                    user: { email: 'jane@parishbook.com', emailVerified: true },
                    organizations: [{ id: 'org_1' }],
                    session: { activeOrganizationId: null },
                }),
            ),
        ).toBe('/dashboard');
    });

    it('honors a safe next path when gates pass', () => {
        expect(
            resolvePostLoginPath(
                ctx({
                    user: { email: 'jane@parishbook.com', emailVerified: true },
                    organizations: [{ id: 'org_1' }],
                    session: { activeOrganizationId: 'org_1' },
                    next: '/dashboard/settings',
                }),
            ),
        ).toBe('/dashboard/settings');
    });
});
