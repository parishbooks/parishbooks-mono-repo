import { organization } from 'better-auth/plugins';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';

export interface OrganizationPluginConfig {
    httpService: HttpService;
}

export class OrganizationPlugin {
    private static logger = new Logger(OrganizationPlugin.name);

    public static init(config: OrganizationPluginConfig) {
        return organization({
            invitationLimit: 1,
            invitationExpiresIn: 1000 * 60 * 60 * 24,
            allowUserToCreateOrganization: true,
            organizationHooks: {
                afterCreateOrganization: async ({ organization, user }) => {
                    this.logger.log(`Organization ${organization.id} created for user ${user.id}`);
                },
            },
        });
    }
}
