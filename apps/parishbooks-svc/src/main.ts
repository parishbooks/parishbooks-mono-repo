import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from '@parishbooks/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: false,
        bufferLogs: true,
    });

    app.useLogger(app.get(Logger));
    app.enableShutdownHooks();
    app.set('trust proxy', 1);

    const config = app.get(ConfigService);
    const globalPrefix = 'api';
    const uiOrigin = config.get<string>('APP_UI_URL') ?? `http://localhost:${config.get('APP_UI_PORT') ?? 3000}`;

    app.setGlobalPrefix(globalPrefix);
    app.enableCors({ origin: uiOrigin, credentials: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.use(helmet());
    app.use(cookieParser());

    const port = Number(config.getOrThrow('APP_SVC_PORT'));
    await app.listen(port);
    app.get(Logger).log(`Application is running on: http://localhost:${port}/${globalPrefix}/v1`);
}

bootstrap().catch((error) => {
    NestLogger.error(error instanceof Error ? error.message : error, error instanceof Error ? error.stack : undefined, 'Bootstrap');
    process.exit(1);
});
