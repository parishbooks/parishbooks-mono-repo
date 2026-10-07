import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { auth as authInstance } from '@parishbooks/iam';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import { isAPIError } from 'better-auth/api';
import type { Response } from 'express';
import { ACCESS_TOKEN_MAX_AGE, ACCESS_TOKEN_NAME } from '../auth/constants';
import { Utils } from '../../library/utils';
import { OrganizationCapabilitiesResponseDto } from './dto/organization-capabilities.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { SetActiveOrganizationDto } from './dto/set-active-organization.dto';
import { OrganizationProfileRepository } from './repository/organization.repository';

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

    async createOrganization(dto: CreateOrganizationDto, sessionToken: string) {
        const headers = Utils.getHeader(sessionToken);
        await this.assertSlugAvailable(dto.slug, headers);
        const body = { name: dto.name, slug: dto.slug, metadata: { timezone: dto.timezone, country: dto.country, currency: dto.currency } };
        const org = await this.auth.api.createOrganization({ body, headers });
        if (!org?.id) throw new BadRequestException('Failed to create organization');
        return await this.organizationProfileRepository.save(
            this.organizationProfileRepository.create({
                organizationId: org.id,
                timezone: dto.timezone,
                country: dto.country,
                currency: dto.currency,
            }),
        );
    }

    async remintAccessToken(sessionToken: string, response: Response): Promise<void> {
        const headers = Utils.getHeader(sessionToken);
        const session = await this.auth.api.getSession({ headers });
        if (!session) throw new BadRequestException('Failed to remint access token');
        const { token } = await this.auth.api.getToken({ headers: Utils.getHeader(session.session.token) });
        response.cookie(ACCESS_TOKEN_NAME, token, { ...Utils.getCookieOptions(), maxAge: ACCESS_TOKEN_MAX_AGE });
    }

    async setActiveOrganization(dto: SetActiveOrganizationDto, sessionToken: string, response: Response) {
        const headers = Utils.getHeader(sessionToken);
        const body = { organizationId: dto.organizationId, organizationSlug: dto.organizationSlug };
        const organization = await this.auth.api.setActiveOrganization({ body, headers });
        await this.remintAccessToken(sessionToken, response);
        return organization;
    }

    async listOrganizations(sessionToken: string) {
        const headers = Utils.getHeader(sessionToken);
        const organizations = await this.auth.api.listOrganizations({ headers });
        return organizations;
    }

    async getOrganization(organizationId: string, sessionToken: string) {
        const headers = Utils.getHeader(sessionToken);
        const organization = await this.auth.api.getOrganization({ headers, query: { organizationId } });
        if (!organization) throw new NotFoundException('Organization not found');
        const organizationProfile = await this.getOrganizationProfile(organizationId);
        return { ...organization, profile: organizationProfile };
    }

    async getOrganizationProfile(organizationId: string) {
        const organizationProfile = await this.organizationProfileRepository.findOne({ where: { organizationId } });
        if (!organizationProfile) throw new NotFoundException('Organization profile not found');
        return organizationProfile;
    }

    async getOrganizationCapabilities(organizationId: string, sessionToken: string): Promise<OrganizationCapabilitiesResponseDto> {
        const organization = await this.getOrganization(organizationId, sessionToken);
        return OrganizationCapabilitiesResponseDto.fromProfile(organizationId, organization.profile);
    }
}
