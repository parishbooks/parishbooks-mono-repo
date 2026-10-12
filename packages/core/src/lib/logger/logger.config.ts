import type { WinstonModuleOptions } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import winston from 'winston';

export type DefineLoggerProps = {
    isProd: boolean;
    ignorePaths?: string[];
    level?: string;
    appName?: string;
};

export const defineLogger = ({ isProd, level, appName = 'ParishBooks' }: DefineLoggerProps): WinstonModuleOptions => {
    const logLevel = level ?? (isProd ? 'info' : 'debug');
    return {
        level: logLevel,
        transports: [
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
        ],
    };
};
