import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationCountry, OrganizationCurrency } from '@parishbooks/database';

export class CreateOrganizationDto {
    @ApiProperty({ example: 'St. Mary Parish' })
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

    @ApiProperty({ example: 'Asia/Kolkata' })
    @IsString()
    @IsNotEmpty()
    timezone: string;

    @ApiProperty({ enum: OrganizationCountry, enumName: 'OrganizationCountry', example: OrganizationCountry.IN })
    @IsEnum(OrganizationCountry)
    country: OrganizationCountry;

    @ApiProperty({ enum: OrganizationCurrency, enumName: 'OrganizationCurrency', example: OrganizationCurrency.INR })
    @IsEnum(OrganizationCurrency)
    currency: OrganizationCurrency;
}
