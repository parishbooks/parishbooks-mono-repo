/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseHook, AuthService as BetterAuthService, AfterCreate } from '@thallesp/nestjs-better-auth';
import { auth as authInstance } from '@parishbooks/iam';
import { Utils } from '../../../../library/utils';
import { APIError } from 'better-auth';

@DatabaseHook()
@Injectable()
export class SessionHook {
    private readonly logger = new Logger(SessionHook.name);
    constructor(private readonly auth: BetterAuthService<typeof authInstance>) {}

    @AfterCreate('session')
    async afterCreateSession(session: any) {
        this.logger.log(`Triggering after create session hook`);
        const headers = Utils.getHeader(session.token);
        const orgs = await this.auth.api.listOrganizations({ headers });
        if (orgs.length === 0) return session;

        this.logger.log('Setting active organization');
        const activeOrg = orgs[0];
        const body = { organizationId: activeOrg.id, organizationSlug: activeOrg.slug };
        const resp = await this.auth.api.setActiveOrganization({ headers, body });
        if (!resp) throw new APIError('BAD_REQUEST', { message: 'Failed to set active organization' });
        return { data: { ...session, session: { ...session.session, activeOrganizationId: resp.id } } };
    }
}
