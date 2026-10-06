import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../decorators/public/public.decorator.js';
import { HealthCheckResponseDto } from './dto/health-check-response.dto.js';
import { PostgresHealthIndicator } from './postgres.health.js';

@ApiTags('health')
@Public()
@SkipThrottle()
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly memory: MemoryHealthIndicator,
        private readonly postgres: PostgresHealthIndicator,
    ) {}

    @Get('live')
    @HealthCheck()
    @ApiOperation({ operationId: 'healthLive', summary: 'Liveness probe' })
    @ApiOkResponse({ type: HealthCheckResponseDto })
    live() {
        return this.health.check([() => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024)]);
    }

    @Get('ready')
    @HealthCheck()
    @ApiOperation({ operationId: 'healthReady', summary: 'Readiness probe' })
    @ApiOkResponse({ type: HealthCheckResponseDto })
    ready() {
        return this.health.check([() => this.postgres.isHealthy('database')]);
    }

    @Get()
    @HealthCheck()
    @ApiOperation({ operationId: 'healthCheck', summary: 'Combined health check' })
    @ApiOkResponse({ type: HealthCheckResponseDto })
    check() {
        return this.health.check([() => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024), () => this.postgres.isHealthy('database')]);
    }
}
