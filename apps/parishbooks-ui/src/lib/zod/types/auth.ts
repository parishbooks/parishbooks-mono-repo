import { z } from 'zod';
import {
    forgotPasswordDtoSchema,
    resetPasswordDtoSchema,
    signInDtoSchema,
    signUpDtoSchema,
    verifyEmailDtoSchema,
    verifyPhoneDtoSchema,
} from '../schemas';

export type SignUpDto = z.infer<typeof signUpDtoSchema>;
export type SignInDto = z.infer<typeof signInDtoSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordDtoSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordDtoSchema>;
export type VerifyEmailDto = z.infer<typeof verifyEmailDtoSchema>;
export type VerifyPhoneDto = z.infer<typeof verifyPhoneDtoSchema>;
