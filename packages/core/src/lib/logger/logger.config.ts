import type { WinstonModuleOptions } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import winston from 'winston';

export type DefineLoggerProps = {
    isProd: boolean;
    ignorePaths?: string[];
    level?: string;
    appName?: string;
    otelLogs?: boolean;
};

export const defineLogger = ({ isProd, level, appName = 'ParishBooks', otelLogs = true }: DefineLoggerProps): WinstonModuleOptions => {
    const logLevel = level ?? (isProd ? 'info' : 'debug');
    const transports: winston.transport[] = [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.errors({ stack: true }),
                nestWinstonModuleUtilities.format.nestLike(appName, {
                    colors: true,
                    prettyPrint: true,
                    processId: true,
                    appName: true,
                }),
            ),
        }),
    ];

    const otelEnabled = otelLogs && process.env.OTEL_SDK_DISABLED !== 'true' && process.env.OTEL_LOGS_EXPORTER !== 'none';
    if (otelEnabled) transports.push(new OpenTelemetryTransportV3());
    return { level: logLevel, transports };
};
