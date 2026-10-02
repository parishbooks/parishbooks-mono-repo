import { Injectable, Logger } from '@nestjs/common';
import type { SendSmsOptions } from './sms.types';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    async send(options: SendSmsOptions): Promise<void> {
        this.logger.warn(`SMS stub: not implemented (to=${options.to}, bodyLength=${options.body.length})`);
    }
}
