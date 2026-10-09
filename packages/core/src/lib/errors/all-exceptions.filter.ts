import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
        const message = this.resolveMessage(exceptionResponse, status);
        const error = this.resolveError(exceptionResponse, status);

        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                { err: exception, path: request.url, method: request.method },
                exception instanceof Error ? exception.message : 'Unhandled exception',
            );
        } else {
            this.logger.warn({ path: request.url, method: request.method, status, message }, 'Request failed');
        }

        response.status(status).json({
            statusCode: status,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
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
