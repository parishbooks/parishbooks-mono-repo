import { Module, OnApplicationShutdown } from '@nestjs/common';
import { shutdownNodeTelemetry } from './telemetry-node';

@Module({})
export class TelemetryModule implements OnApplicationShutdown {
    async onApplicationShutdown(): Promise<void> {
        await shutdownNodeTelemetry();
    }
}
