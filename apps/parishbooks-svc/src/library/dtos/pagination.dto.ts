import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({ description: 'Total number of items', example: 100 })
    total: number;

    @ApiProperty({ description: 'Current page number', example: 1, minimum: 1 })
    page: number;

    @ApiProperty({ description: 'Number of items per page', example: 10, minimum: 1 })
    limit: number;

    @ApiProperty({ description: 'Whether there is a next page', example: true })
    hasNextPage: boolean;

    @ApiProperty({ description: 'Whether there is a previous page', example: true })
    hasPreviousPage: boolean;
}

export class PaginatedResponseDto<TData> {
    data: TData[];

    @ApiProperty({ description: 'Pagination', type: PaginationDto })
    pagination: PaginationDto;
}
