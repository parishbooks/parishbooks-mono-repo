import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';

@Module({})
export class CommunicationsModule {
    static forRootAsync(): DynamicModule {
        return {
            module: CommunicationsModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: EmailService,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) =>
                        new EmailService({
                            host: configService.getOrThrow('SMTP_HOST'),
                            port: Number(configService.get('SMTP_PORT') || '465'),
                            secure: configService.get('SMTP_SECURE') !== 'false',
                            user: configService.getOrThrow('SMTP_USER'),
                            pass: configService.getOrThrow('SMTP_PASS'),
                            from: configService.get('SMTP_FROM') || configService.getOrThrow('SMTP_USER'),
                        }),
                },
                SmsService,
            ],
            exports: [EmailService, SmsService],
        };
    }
}
