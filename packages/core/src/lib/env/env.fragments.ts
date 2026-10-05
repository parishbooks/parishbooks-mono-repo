import { z } from 'zod';

export const nodeEnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const throttleEnvSchema = z.object({
    THROTTLE_TTL: z.coerce.number().int().positive().default(60_000),
    THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
});

export const databaseEnvSchema = z.object({
    DATABASE_URL: z.string().min(1),
});

export const smtpEnvSchema = z.object({
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive().default(465),
    SMTP_SECURE: z.string().optional(),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM: z.string().optional(),
});

export const createEnvValidator = <T extends z.ZodTypeAny>(schema: T) => {
    return (config: Record<string, unknown>): z.infer<T> => {
        const result = schema.safeParse(config);
        if (result.success) return result.data;
        const details = result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join('; ');
        throw new Error(`Invalid environment configuration: ${details}`);
    };
};
