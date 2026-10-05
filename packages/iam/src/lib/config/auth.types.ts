import type { EmailService } from '@parishbooks/communications';

export interface AuthConfig {
    secret: string;
    databaseUrl: string;
    baseURL: string;
    trustedOrigins: string[];
    emailService: EmailService;
}
