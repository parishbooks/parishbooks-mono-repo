import type { NextFunction, Request, Response } from 'express';
import type winston from 'winston';
import { formatHttpAccessLine, httpElapsedMs, httpRequestPath, isHttpSuccessStatus, markHttpRequestStart } from './http-log.utils';

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

        markHttpRequestStart(req);
        res.on('finish', () => {
            const statusCode = res.statusCode;
            if (!isHttpSuccessStatus(statusCode)) return;

            const durationMs = httpElapsedMs(req);
            if (durationMs === undefined) return;

            const path = httpRequestPath(req.url);
            logger.info(formatHttpAccessLine(req.method, path, statusCode, durationMs));
        });
        next();
    };
