import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { EmailService } from '@parishbooks/communications';
import { defineAuth } from '@parishbooks/iam';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceHelper } from './helpers/auth-service.helper';

@Module({
    imports: [
        BetterAuthModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService, EmailService],
            useFactory: (configService: ConfigService, emailService: EmailService) => ({
                auth: defineAuth({
                    secret: configService.getOrThrow('IAM_SECRET'),
                    baseURL: configService.get('APP_SVC_URL') || configService.get('IAM_BASE_URL') || '',
                    databaseUrl: configService.getOrThrow('DATABASE_URL'),
                    trustedOrigins: [configService.get('APP_UI_URL') || 'http://localhost:3000'],
                    emailService,
                }),
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthServiceHelper, AuthService],
})
export class AuthModule {}
