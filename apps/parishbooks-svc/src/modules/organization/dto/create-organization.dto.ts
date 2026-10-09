import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationCountry, OrganizationCurrency, OrganizationFiscalYear, OrganizationLanguage } from '@parishbooks/database';

export class CreateOrganizationDto {
    @ApiProperty({ example: 'St. Mary Parish', description: 'Display name for the workspace' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'st-mary-parish' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(64)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be lowercase alphanumeric with optional hyphens' })
    slug: string;

    @ApiProperty({ example: 'St. Mary Parish Trust', description: 'Legal organization name' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    legalName: string;

    @ApiProperty({ enum: OrganizationCountry, enumName: 'OrganizationCountry', example: OrganizationCountry.IN, description: 'Business location' })
    @IsEnum(OrganizationCountry)
    country: OrganizationCountry;

    @ApiProperty({ enum: OrganizationCurrency, enumName: 'OrganizationCurrency', example: OrganizationCurrency.INR, description: 'Base currency' })
    @IsEnum(OrganizationCurrency)
    currency: OrganizationCurrency;

    @ApiProperty({ enum: OrganizationLanguage, enumName: 'OrganizationLanguage', example: OrganizationLanguage.EN })
    @IsEnum(OrganizationLanguage)
    language: OrganizationLanguage;

    @ApiProperty({ enum: OrganizationFiscalYear, enumName: 'OrganizationFiscalYear', example: OrganizationFiscalYear.APR_MAR })
    @IsEnum(OrganizationFiscalYear)
    fiscalYear: OrganizationFiscalYear;

    @ApiProperty({ example: 'Asia/Kolkata', description: 'Time zone' })
    @IsString()
    @IsNotEmpty()
    timezone: string;
}
