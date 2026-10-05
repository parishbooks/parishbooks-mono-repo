import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SetActiveOrganizationDto {
    @ApiPropertyOptional({ nullable: true, example: 'org_abc123', description: 'Organization id to activate, or null to unset' })
    @IsOptional()
    @ValidateIf((_, value) => value !== null)
    @IsString()
    organizationId?: string | null;

    @ApiPropertyOptional({ example: 'st-mary-parish', description: 'Organization slug to activate when organizationId is omitted' })
    @IsOptional()
    @IsString()
    organizationSlug?: string;
}
