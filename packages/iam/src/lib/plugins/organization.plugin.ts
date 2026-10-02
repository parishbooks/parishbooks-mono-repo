import { organization } from 'better-auth/plugins';
import { HttpService } from '@nestjs/axios';

export interface OrganizationPluginConfig {
    httpService: HttpService;
}

export class OrganizationPlugin {
    public static init(config: OrganizationPluginConfig) {
        return organization({});
    }
}
