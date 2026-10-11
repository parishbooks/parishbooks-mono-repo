import { z } from 'zod';

export const AuthUserSchema = z.object({
    id: z.string(),
    email: z.email(),
    tenantId: z.string(),
    emailVerified: z.boolean(),
    username: z.string(),
    roles: z.array(z.string()),
});
