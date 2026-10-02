import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';
import type { SendEmailOptions } from './email.types';
import { smtpConfigFromEnv, type SmtpConfig } from './smtp-env';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly transporter: Transporter;
    private readonly from: string;

    constructor() {
        const config = smtpConfigFromEnv();
        this.from = config.from;
        this.transporter = this.createTransporter(config);
    }

    async send(options: SendEmailOptions) {
        const info = await this.transporter.sendMail({
            from: options.from ?? this.from,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        this.logger.log(`Email sent to ${Array.isArray(options.to) ? options.to.join(', ') : options.to} (${info.messageId})`);
        return info;
    }

    private createTransporter(config: SmtpConfig): Transporter {
        return nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: { user: config.user, pass: config.pass },
        });
    }
}
