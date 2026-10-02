import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = Number(process.env.APP_SVC_PORT);
    await app.listen(port, () => Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`));
}

bootstrap();
