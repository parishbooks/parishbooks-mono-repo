import { DynamicModule, InjectionToken, Module, ModuleMetadata, OptionalFactoryDependency, Provider } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { SMTP_CONFIG, type SmtpConfig } from './email/email.types';
import { SmsService } from './sms/sms.service';

export interface CommunicationsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useFactory: (...args: any[]) => SmtpConfig | Promise<SmtpConfig>;
}

@Module({})
export class CommunicationsModule {
    static forRootAsync(options: CommunicationsModuleAsyncOptions): DynamicModule {
        const smtpConfigProvider: Provider = {
            provide: SMTP_CONFIG,
            inject: options.inject ?? [],
            useFactory: options.useFactory,
        };

        return {
            module: CommunicationsModule,
            global: true,
            imports: options.imports ?? [],
            providers: [smtpConfigProvider, EmailService, SmsService],
            exports: [EmailService, SmsService],
        };
    }
}
