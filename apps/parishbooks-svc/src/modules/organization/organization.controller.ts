import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponseDto, Token } from '@parishbooks/core';
import { ACCESS_TOKEN_NAME } from '../auth/constants';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationService } from './organization.service';

@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @Post()
    @ApiOperation({ operationId: 'createOrganization', summary: 'Create an organization and profile' })
    @ApiCookieAuth(ACCESS_TOKEN_NAME)
    @ApiBody({ type: CreateOrganizationDto })
    @ApiCreatedResponse({ description: 'Organization profile created' })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    async createOrganization(@Body() dto: CreateOrganizationDto, @Token('access') accessToken: string) {
        return this.organizationService.createOrganization(dto, accessToken);
    }
}
