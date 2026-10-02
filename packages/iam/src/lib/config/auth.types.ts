export interface AuthConfig {
    secret: string;
    databaseUrl: string;
    baseURL: string;
    trustedOrigins: string[];
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
    smtpUser: string;
    smtpPass: string;
    smtpFrom: string;
}
