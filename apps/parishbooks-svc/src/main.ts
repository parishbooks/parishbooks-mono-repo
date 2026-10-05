import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    const globalPrefix = 'api';

    const uiOrigin = process.env.APP_UI_URL || `http://localhost:${process.env.APP_UI_PORT || '3000'}`;
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({ origin: uiOrigin, credentials: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.use(cookieParser());

    const port = Number(process.env.APP_SVC_PORT);
    await app.listen(port, () => Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}/v1`));
}

bootstrap();
