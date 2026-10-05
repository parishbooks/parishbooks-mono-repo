import { Inject, Injectable, Logger } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';
import { SMTP_CONFIG, type SendEmailOptions, type SmtpConfig } from './email.types';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly transporter: Transporter;
    private readonly from: string;

    constructor(@Inject(SMTP_CONFIG) config: SmtpConfig) {
        this.from = config.from;
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: { user: config.user, pass: config.pass },
        });
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
}
