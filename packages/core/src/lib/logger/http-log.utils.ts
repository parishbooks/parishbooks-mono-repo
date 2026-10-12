import type { Request } from 'express';

export type RequestWithHttpTiming = Request & { parishbooksRequestStart?: bigint };

export const markHttpRequestStart = (req: Request): void => {
    (req as RequestWithHttpTiming).parishbooksRequestStart = process.hrtime.bigint();
};

export const httpRequestPath = (url: string | undefined): string => (typeof url === 'string' ? (url.split('?')[0] ?? url) : '');

export const httpElapsedMs = (req: Request, end: bigint = process.hrtime.bigint()): number | undefined => {
    const start = (req as RequestWithHttpTiming).parishbooksRequestStart;
    if (start === undefined) return undefined;
    return Math.round((Number(end - start) / 1_000_000) * 100) / 100;
};

export const isHttpSuccessStatus = (statusCode: number): boolean => statusCode >= 200 && statusCode < 300;

export const formatHttpAccessLine = (method: string, path: string, statusCode: number, durationMs: number): string =>
    `${method} ${path} ${statusCode} ${durationMs}ms`;
