export interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
}

export function smtpConfigFromEnv(env: NodeJS.ProcessEnv = process.env): SmtpConfig {
    const host = env.SMTP_HOST;
    const port = Number(env.SMTP_PORT ?? '465');
    const secure = env.SMTP_SECURE !== 'false';
    const user = env.SMTP_USER;
    const pass = env.SMTP_PASS;
    const from = env.SMTP_FROM ?? user;
    if (!host?.trim() || !user?.trim() || !pass?.trim() || !from?.trim() || !Number.isFinite(port)) throw new Error('Missing SMTP environment variables');
    return { host, port, secure, user, pass, from };
}
