import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { CORRELATION_ID_HEADER } from './correlation.constants.js';
import { correlationStorage, type CorrelationStore } from './correlation.context.js';

export type CorrelatedRequest = IncomingMessage & {
    id?: unknown;
    correlationId?: string;
};

const readHeader = (value: string | string[] | undefined): string | undefined => {
    if (Array.isArray(value)) return value[0];
    return value;
};

export const resolveCorrelationId = (req: IncomingMessage): CorrelationStore => {
    const correlationId = readHeader(req.headers[CORRELATION_ID_HEADER]) || randomUUID();
    return { correlationId };
};

export const applyCorrelationHeaders = (req: CorrelatedRequest, res: ServerResponse, store: CorrelationStore): void => {
    req.id = store.correlationId;
    req.correlationId = store.correlationId;
    req.headers[CORRELATION_ID_HEADER] = store.correlationId;
    res.setHeader(CORRELATION_ID_HEADER, store.correlationId);
};

export const runWithCorrelation = <T>(store: CorrelationStore, fn: () => T): T => correlationStorage.run(store, fn);
