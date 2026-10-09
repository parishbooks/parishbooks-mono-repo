import { registerAs } from '@nestjs/config';

export default registerAs('smtp', () => ({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? '465'),
    secure: process.env.SMTP_SECURE !== 'false',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
}));
