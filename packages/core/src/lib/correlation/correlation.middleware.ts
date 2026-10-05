import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { applyCorrelationHeaders, resolveCorrelationId, runWithCorrelation, type CorrelatedRequest } from './correlation.utils.js';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        const store = resolveCorrelationId(req);
        applyCorrelationHeaders(req as unknown as CorrelatedRequest, res, store);
        runWithCorrelation(store, () => next());
    }
}
