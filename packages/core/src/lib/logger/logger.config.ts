import type { WinstonModuleOptions } from 'nest-winston';
import type { Request, Response, NextFunction } from 'express';
import winston from 'winston';

export type DefineLoggerProps = {
    isProd: boolean;
    ignorePaths?: string[];
    level?: string;
};

const shouldIgnorePath = (url: string | undefined, ignorePaths: string[]): boolean => typeof url === 'string' && ignorePaths.some((path) => url.includes(path));

export const defineLogger = ({ isProd, level }: DefineLoggerProps): WinstonModuleOptions => {
    const logLevel = level ?? (isProd ? 'info' : 'debug');

    const devFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
            const metaKeys = Object.keys(meta).filter((key) => key !== 'service');
            const suffix = metaKeys.length > 0 ? ` ${JSON.stringify(meta)}` : '';
            const line = stack ? `${message}\n${stack}` : message;
            return `${timestamp} ${level}: ${line}${suffix}`;
        }),
    );

    const prodFormat = winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json());

    return {
        level: logLevel,
        format: isProd ? prodFormat : devFormat,
        transports: [new winston.transports.Console()],
    };
};

export type HttpLoggingMiddlewareOptions = {
    ignorePaths?: string[];
};

export const createHttpLoggingMiddleware =
    (logger: winston.Logger, { ignorePaths = ['/health'] }: HttpLoggingMiddlewareOptions = {}) =>
    (req: Request, res: Response, next: NextFunction): void => {
        if (shouldIgnorePath(req.url, ignorePaths)) {
            next();
            return;
        }

        const start = process.hrtime.bigint();
        res.on('finish', () => {
            const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
            logger.info('request completed', {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                durationMs: Math.round(durationMs * 100) / 100,
            });
        });
        next();
    };
