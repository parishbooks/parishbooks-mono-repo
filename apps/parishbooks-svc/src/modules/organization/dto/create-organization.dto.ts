import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
