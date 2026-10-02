import { z } from 'zod';
import { signUpSchema } from '@/components/auth/schemas';

export type SignUpValues = z.infer<typeof signUpSchema>;
