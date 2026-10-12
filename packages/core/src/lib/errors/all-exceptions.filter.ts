import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import type { Logger } from 'winston';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
        const message = this.resolveMessage(exceptionResponse, status);
        const error = this.resolveError(exceptionResponse, status);

        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            const body = { err: exception, path: request.url, method: request.method };
            this.logger.error(exception instanceof Error ? exception.message : 'Unhandled exception', body);
        } else {
            this.logger.warn('Request failed', { path: request.url, method: request.method, status, message });
        }

        const body: Record<string, unknown> = { statusCode: status, message, error, timestamp: new Date().toISOString(), path: request.url };
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const extra = exceptionResponse as Record<string, unknown>;
            if (typeof extra.code === 'string') body.code = extra.code;
            if (typeof extra.redirectTo === 'string') body.redirectTo = extra.redirectTo;
            if (typeof extra.email === 'string') body.email = extra.email;
        }
        response.status(status).json(body);
    }

    private resolveMessage(exceptionResponse: string | object | null, status: number): string | string[] {
        if (typeof exceptionResponse === 'string') return exceptionResponse;
        if (typeof exceptionResponse === 'object' && exceptionResponse && 'message' in exceptionResponse) {
            return (exceptionResponse as { message: string | string[] }).message;
        }
        return status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'Internal server error' : 'Request failed';
    }

    private resolveError(exceptionResponse: string | object | null, status: number): string | undefined {
        if (typeof exceptionResponse === 'object' && exceptionResponse && 'error' in exceptionResponse) {
            return (exceptionResponse as { error: string }).error;
        }
        return status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'Internal Server Error' : undefined;
    }
}
