import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { auth as authInstance } from '@parishbooks/iam';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import { isAPIError } from 'better-auth/api';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationProfileRepository } from './repository/organization.repository';
import { Utils } from '../../library/utils';

@Injectable()
export class OrganizationService {
    constructor(
        private readonly auth: BetterAuthService<typeof authInstance>,
        private readonly organizationProfileRepository: OrganizationProfileRepository,
    ) {}

    async assertSlugAvailable(slug: string, headers: Headers): Promise<void> {
        await this.auth.api.checkOrganizationSlug({ body: { slug }, headers }).catch((error) => {
            if (isAPIError(error)) throw new BadRequestException(error.body?.message ?? 'Organization slug is not available');
            throw error;
        });
    }

    async createOrganization(dto: CreateOrganizationDto, accessToken: string) {
        const headers = Utils.getHeader(accessToken);
        await this.assertSlugAvailable(dto.slug, headers);

        try {
            const org = await this.auth.api.createOrganization({ body: { name: dto.name, slug: dto.slug, metadata: { timezone: dto.timezone } }, headers });
            if (!org?.id) throw new BadRequestException('Failed to create organization');
            const orgProfile = this.organizationProfileRepository.create({ organizationId: org.id, timezone: dto.timezone });
            return await this.organizationProfileRepository.save(orgProfile);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) throw error;
            if (isAPIError(error)) throw new BadRequestException(error.body?.message ?? 'Failed to create organization');
            throw error;
        }
    }
}
