import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Params } from 'nestjs-pino';
import { getCorrelationId } from '../correlation/correlation.context.js';
import { applyCorrelationHeaders, resolveCorrelationId, type CorrelatedRequest } from '../correlation/correlation.utils.js';

export type DefineLoggerProps = {
    isProd: boolean;
    ignorePaths?: string[];
    level?: string;
};

export const defineLogger = ({ isProd, ignorePaths = ['/health'], level }: DefineLoggerProps): Params => ({
    pinoHttp: {
        level: level ?? (isProd ? 'info' : 'debug'),
        transport: isProd ? undefined : { target: 'pino-pretty', options: { singleLine: true, colorize: true } },
        autoLogging: { ignore: (req) => typeof req.url === 'string' && ignorePaths.some((path) => req.url?.includes(path)) },
        serializers: { req: (req) => ({ method: req.method, url: req.url, correlationId: (req as CorrelatedRequest).correlationId }) },
        customProps: (req) => ({ correlationId: (req as CorrelatedRequest).correlationId ?? getCorrelationId() }),
        genReqId: (req: IncomingMessage, res: ServerResponse) => {
            const store = resolveCorrelationId(req);
            applyCorrelationHeaders(req as CorrelatedRequest, res, store);
            return store.correlationId;
        },
        mixin: () => {
            const correlationId = getCorrelationId();
            if (!correlationId) return {};
            return { correlationId };
        },
    },
});
