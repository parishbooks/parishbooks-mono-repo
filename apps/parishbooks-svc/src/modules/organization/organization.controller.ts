import { Body, Controller, Post, Res } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto, Token } from '@parishbooks/core';
import type { Response } from 'express';
import { SESSION_TOKEN_NAME } from '../auth/constants';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { SetActiveOrganizationDto } from './dto/set-active-organization.dto';
import { OrganizationService } from './organization.service';

@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

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
