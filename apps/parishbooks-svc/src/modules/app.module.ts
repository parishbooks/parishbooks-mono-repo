import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommunicationsModule } from '@parishbooks/communications';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CommunicationsModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                host: configService.getOrThrow('SMTP_HOST'),
                port: Number(configService.get('SMTP_PORT') || '465'),
                secure: configService.get('SMTP_SECURE') !== 'false',
                user: configService.getOrThrow('SMTP_USER'),
                pass: configService.getOrThrow('SMTP_PASS'),
                from: configService.get('SMTP_FROM') || configService.getOrThrow('SMTP_USER'),
            }),
        }),
        AuthModule,
    ],
})
export class AppModule {}
