import { z } from 'zod';
import { CreateUserAccountSchema } from '../schema/create-user-account.schema';
import { JwtPayloadSchema } from '../schema/jwt-payload.schema';
import { AuthUserSchema } from '../schema/auth-user.schema';

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type CreateUserAccountDto = z.infer<typeof CreateUserAccountSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
