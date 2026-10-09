import { z } from 'zod';
import { CreateUserAccountSchema } from '../schema/create-user-account.schema';
import { JwtPayloadSchema } from '../schema/jwt-payload.schema';

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type CreateUserAccountDto = z.infer<typeof CreateUserAccountSchema>;
