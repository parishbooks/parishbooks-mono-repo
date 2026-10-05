import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    APP_SVC_PORT: z.coerce.number().int().positive(),
    APP_UI_PORT: z.coerce.number().int().positive().optional(),
    APP_UI_URL: z.url().optional(),
    APP_SVC_URL: z.url().optional(),
    IAM_BASE_URL: z.url().optional(),
    IAM_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive().default(465),
    SMTP_SECURE: z.string().optional(),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM: z.string().optional(),
    THROTTLE_TTL: z.coerce.number().int().positive().default(60_000),
    THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
}).passthrough();

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
    const result = envSchema.safeParse(config);
    if (result.success) return result.data;

    const details = result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
}
