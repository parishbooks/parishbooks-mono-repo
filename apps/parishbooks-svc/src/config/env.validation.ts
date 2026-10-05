import { createEnvValidator, databaseEnvSchema, nodeEnvSchema, smtpEnvSchema, throttleEnvSchema } from '@parishbooks/core';
import { z } from 'zod';

export const envSchema = z
    .object({
        APP_SVC_PORT: z.coerce.number().int().positive(),
        APP_UI_PORT: z.coerce.number().int().positive().optional(),
        APP_UI_URL: z.url().optional(),
        APP_SVC_URL: z.url().optional(),
        IAM_BASE_URL: z.url().optional(),
        IAM_SECRET: z.string().min(1),
    })
    .extend(nodeEnvSchema.shape)
    .extend(databaseEnvSchema.shape)
    .extend(smtpEnvSchema.shape)
    .extend(throttleEnvSchema.shape)
    .passthrough();

export type Env = z.infer<typeof envSchema>;

export const validateEnv = createEnvValidator(envSchema);
