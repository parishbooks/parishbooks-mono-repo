import type { Type } from '@nestjs/common';
import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import type { Logger } from 'winston';
import { defineHelmet } from '../helmet/helmet.config';
import { createHttpLoggingMiddleware } from '../logger/logger.middleware';
import { setupSwagger, type DefineSwaggerProps } from '../swagger/swagger.config';

export type ApplicationInitProps = {
    module: Type<unknown>;
    port: number;
    globalPrefix?: string;
    defaultVersion?: string | null;
    isProd?: boolean;
    corsOrigin?: string | string[];
    bodyParser?: boolean;
    trustProxy?: boolean | number | string | false;
    enableShutdownHooks?: boolean;
    bufferLogs?: boolean;
    cookieParser?: boolean;
    helmet?: boolean;
    swagger?: DefineSwaggerProps | false;
    httpLogIgnorePaths?: string[];
    onReady?: (app: NestExpressApplication, urls: { api: string; swagger?: string; openApiJson?: string }) => void;
};

export class Application {
    static async create(props: ApplicationInitProps): Promise<NestExpressApplication> {
        const {
            module,
            globalPrefix = 'api',
            defaultVersion = '1',
            isProd = process.env.NODE_ENV === 'production',
            corsOrigin,
            trustProxy = 1,
            enableShutdownHooks = true,
            bufferLogs = true,
            cookieParser: useCookieParser = true,
            helmet: useHelmet = true,
            swagger,
            httpLogIgnorePaths = ['/health', '/metrics', '/api/docs'],
        } = props;

        const app = await NestFactory.create<NestExpressApplication>(module, { bufferLogs });
        const swaggerConfig = typeof swagger === 'object' ? swagger : undefined;
        const winstonLogger = app.get<Logger>(WINSTON_MODULE_PROVIDER);

        app.use(createHttpLoggingMiddleware(winstonLogger, { ignorePaths: httpLogIgnorePaths }));
        app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
        if (enableShutdownHooks) app.enableShutdownHooks();
        if (trustProxy !== false) app.set('trust proxy', trustProxy);

        app.setGlobalPrefix(globalPrefix);
        if (corsOrigin) app.enableCors({ origin: corsOrigin, credentials: true });
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
        if (defaultVersion !== null) app.enableVersioning({ type: VersioningType.URI, defaultVersion });
        if (useHelmet) app.use(helmet(defineHelmet({ isProd })));
        if (useCookieParser) app.use(cookieParser());
        if (swaggerConfig) setupSwagger(app, swaggerConfig);

        await app.init();
        return app;
    }

    static async init(props: ApplicationInitProps): Promise<NestExpressApplication> {
        const { port, defaultVersion = '1', globalPrefix = 'api', swagger, onReady } = props;

        const app = await Application.create(props);
        const swaggerConfig = typeof swagger === 'object' ? swagger : undefined;
        const nestLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);

        await app.listen(port);

        const apiUrl = `http://localhost:${port}/${globalPrefix}${defaultVersion ? `/v${defaultVersion}` : ''}`;
        const swaggerPath = swaggerConfig ? (swaggerConfig.path ?? 'api/docs') : undefined;
        const swaggerUrl = swaggerPath ? `http://localhost:${port}/${swaggerPath}` : undefined;
        const openApiJsonUrl = swaggerPath ? `http://localhost:${port}/${swaggerConfig?.jsonDocumentUrl ?? `${swaggerPath}-json`}` : undefined;
        const urls = { api: apiUrl, swagger: swaggerUrl, openApiJson: openApiJsonUrl };

        nestLogger.log(`Application is running on: ${urls.api}`);
        if (urls.swagger) nestLogger.log(`Swagger UI: ${urls.swagger}`);
        if (urls.openApiJson) nestLogger.log(`OpenAPI JSON: ${urls.openApiJson}`);
        onReady?.(app, urls);

        return app;
    }

    static async bootstrap(props: ApplicationInitProps): Promise<void> {
        try {
            await Application.init(props);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const detail = message.trim().length > 0 ? message : error;
            NestLogger.error(detail, error instanceof Error ? error.stack : undefined, 'Bootstrap');
            process.exit(1);
        }
    }
}
