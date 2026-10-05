import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorService } from '@nestjs/terminus';
import { Client } from 'pg';

@Injectable()
export class PostgresHealthIndicator {
    constructor(
        private readonly healthIndicatorService: HealthIndicatorService,
        private readonly configService: ConfigService,
    ) {}

    async isHealthy(key: string) {
        const indicator = this.healthIndicatorService.check(key);
        const client = new Client({ connectionString: this.configService.getOrThrow<string>('DATABASE_URL') });

        try {
            await client.connect();
            await client.query('SELECT 1');
            return indicator.up();
        } catch (error) {
            return indicator.down({ message: error instanceof Error ? error.message : 'PostgreSQL unavailable' });
        } finally {
            await client.end().catch(() => undefined);
        }
    }
}
