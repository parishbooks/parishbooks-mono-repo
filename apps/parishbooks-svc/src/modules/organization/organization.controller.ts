import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto, Token } from '@parishbooks/core';
import type { Response } from 'express';
import { SESSION_TOKEN_NAME } from '../auth/constants';
import { OrganizationCapabilitiesResponseDto } from './dto/organization-capabilities.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { SetActiveOrganizationDto } from './dto/set-active-organization.dto';
import { OrganizationService } from './organization.service';

@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Get()
    @ApiOperation({ operationId: 'listOrganizations', summary: 'List organizations for the current user' })
    @ApiCookieAuth(SESSION_TOKEN_NAME)
    @ApiOkResponse({ description: 'Organizations the current user belongs to' })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    async listOrganizations(@Token('session') sessionToken: string) {
        return this.organizationService.listOrganizations(sessionToken);
    }

    @Get(':organizationId/profile')
    @ApiOperation({ operationId: 'getOrganizationProfile', summary: 'Get an organization profile' })
    @ApiCookieAuth(SESSION_TOKEN_NAME)
    @ApiParam({ name: 'organizationId', description: 'Organization id' })
    @ApiOkResponse({ description: 'Organization profile' })
    @ApiNotFoundResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    async getOrganizationProfile(@Param('organizationId') organizationId: string) {
        return this.organizationService.getOrganizationProfile(organizationId);
    }

    @Get(':organizationId/capabilities')
    @ApiOperation({ operationId: 'getOrganizationCapabilities', summary: 'Get derived organization capabilities and verification status' })
    @ApiCookieAuth(SESSION_TOKEN_NAME)
    @ApiParam({ name: 'organizationId', description: 'Organization id' })
    @ApiOkResponse({ type: OrganizationCapabilitiesResponseDto })
    @ApiNotFoundResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    async getOrganizationCapabilities(@Param('organizationId') organizationId: string, @Token('session') sessionToken: string) {
        return this.organizationService.getOrganizationCapabilities(organizationId, sessionToken);
    }

    @Get(':organizationId')
    @ApiOperation({ operationId: 'getOrganization', summary: 'Get an organization with its profile' })
    @ApiCookieAuth(SESSION_TOKEN_NAME)
    @ApiParam({ name: 'organizationId', description: 'Organization id' })
    @ApiOkResponse({ type: OrganizationResponseDto, description: 'Organization with profile' })
    @ApiNotFoundResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    async getOrganization(@Param('organizationId') organizationId: string, @Token('session') sessionToken: string) {
        return this.organizationService.getOrganization(organizationId, sessionToken);
    }

    @Post()
    @ApiOperation({ operationId: 'createOrganization', summary: 'Create an organization and profile' })
    @ApiCookieAuth(SESSION_TOKEN_NAME)
    @ApiBody({ type: CreateOrganizationDto })
    @ApiCreatedResponse({ description: 'Organization profile created' })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    async createOrganization(@Body() dto: CreateOrganizationDto, @Token('session') sessionToken: string, @Res({ passthrough: true }) response: Response) {
        const { organizationId } = await this.organizationService.createOrganization(dto, sessionToken);
        return this.organizationService.setActiveOrganization({ organizationId }, sessionToken, response);
    }

    @Post('activate')
    @ApiOperation({ operationId: 'setActiveOrganization', summary: 'Set the active organization for the current session' })
    @ApiCookieAuth(SESSION_TOKEN_NAME)
    @ApiBody({ type: SetActiveOrganizationDto })
    @ApiOkResponse({ description: 'Active organization updated; pb_access_token reminted with the new organizationId' })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    async setActiveOrganization(@Body() dto: SetActiveOrganizationDto, @Token('session') sessionToken: string, @Res({ passthrough: true }) response: Response) {
        return this.organizationService.setActiveOrganization(dto, sessionToken, response);
    }
}
