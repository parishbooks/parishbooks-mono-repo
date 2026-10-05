import type { Type } from '@nestjs/common';
import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { defineHelmet } from '../helmet/helmet.config.js';
import { setupSwagger, type DefineSwaggerProps } from '../swagger/swagger.config.js';

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
    onReady?: (app: NestExpressApplication, urls: { api: string; swagger?: string; openApiJson?: string }) => void;
};

export class Application {
    static async init(props: ApplicationInitProps): Promise<NestExpressApplication> {
        const {
            module,
            port,
            globalPrefix = 'api',
            defaultVersion = '1',
            isProd = process.env.NODE_ENV === 'production',
            corsOrigin,
            bodyParser = false,
            trustProxy = 1,
            enableShutdownHooks = true,
            bufferLogs = true,
            cookieParser: useCookieParser = true,
            helmet: useHelmet = true,
            swagger,
            onReady,
        } = props;

        const app = await NestFactory.create<NestExpressApplication>(module, { bodyParser, bufferLogs });
        const swaggerConfig = typeof swagger === 'object' ? swagger : undefined;

        app.useLogger(app.get(Logger));
        if (enableShutdownHooks) app.enableShutdownHooks();
        if (trustProxy !== false) app.set('trust proxy', trustProxy);

        app.setGlobalPrefix(globalPrefix);
        if (corsOrigin) app.enableCors({ origin: corsOrigin, credentials: true });
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
        if (defaultVersion !== null) app.enableVersioning({ type: VersioningType.URI, defaultVersion });
        if (useHelmet) app.use(helmet(defineHelmet({ isProd })));
        if (useCookieParser) app.use(cookieParser());
        if (swaggerConfig) setupSwagger(app, swaggerConfig);

        await app.listen(port);

        const apiUrl = `http://localhost:${port}/${globalPrefix}${defaultVersion ? `/v${defaultVersion}` : ''}`;
        const swaggerPath = swaggerConfig ? (swaggerConfig.path ?? 'api/docs') : undefined;
        const urls = {
            api: apiUrl,
            swagger: swaggerPath ? `http://localhost:${port}/${swaggerPath}` : undefined,
            openApiJson: swaggerPath ? `http://localhost:${port}/${swaggerConfig?.jsonDocumentUrl ?? `${swaggerPath}-json`}` : undefined,
        };

        const logger = app.get(Logger);
        logger.log(`Application is running on: ${urls.api}`);
        if (urls.swagger) logger.log(`Swagger UI: ${urls.swagger}`);
        if (urls.openApiJson) logger.log(`OpenAPI JSON: ${urls.openApiJson}`);
        onReady?.(app, urls);

        return app;
    }

    static async bootstrap(props: ApplicationInitProps): Promise<void> {
        try {
            await Application.init(props);
        } catch (error) {
            NestLogger.error(error instanceof Error ? error.message : error, error instanceof Error ? error.stack : undefined, 'Bootstrap');
            process.exit(1);
        }
    }
}
