import type { NextFunction, Request, Response } from 'express';
import type winston from 'winston';

export type HttpLoggingMiddlewareOptions = {
    ignorePaths?: string[];
};

const shouldIgnorePath = (url: string | undefined, ignorePaths: string[]): boolean => typeof url === 'string' && ignorePaths.some((path) => url.includes(path));

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
            logger.info('request completed', { method: req.method, url: req.url, statusCode: res.statusCode, durationMs: Math.round(durationMs * 100) / 100 });
        });
        next();
    };
