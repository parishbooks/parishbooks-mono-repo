import { z } from 'zod';

export const AuthUserSchema = z.object({
    id: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
    username: z.string(),
    roles: z.array(z.string()),
    banned: z.boolean(),
});
