import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { PostgresHealthIndicator } from './postgres.health';

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
    live() {
        return this.health.check([() => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024)]);
    }

    @Get('ready')
    @HealthCheck()
    ready() {
        return this.health.check([() => this.postgres.isHealthy('database')]);
    }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
            () => this.postgres.isHealthy('database'),
        ]);
    }
}
