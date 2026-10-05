import { z } from 'zod';

export const emailDtoSchema = z.string().min(1, 'Email is required.').email('Enter a valid email address.');
export const requiredPasswordDtoSchema = z.string().min(1, 'Password is required.');
export const newPasswordDtoSchema = z.string().min(1, 'Password is required.').min(8, 'Use at least 8 characters.').max(128, 'Use at most 128 characters.');
export const otpDtoSchema = z.string().min(6, 'Enter the 6-digit code.');

export const signUpDtoSchema = z.object({
    name: z.string().min(1, 'Full name is required.'),
    email: emailDtoSchema,
    password: newPasswordDtoSchema,
});

export const signInDtoSchema = z.object({
    email: emailDtoSchema,
    password: requiredPasswordDtoSchema,
});

export const forgotPasswordDtoSchema = z.object({
    email: emailDtoSchema,
});

export const resetPasswordDtoSchema = z
    .object({
        password: newPasswordDtoSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password.'),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export const verifyEmailDtoSchema = z.object({
    otp: otpDtoSchema,
});

export const verifyPhoneDtoSchema = z.object({
    otp: otpDtoSchema,
});
