import { z } from 'zod';

export const emailSchema = z.string().min(1, 'Email is required.').email('Enter a valid email address.');
export const requiredPasswordSchema = z.string().min(1, 'Password is required.');
export const newPasswordSchema = z.string().min(1, 'Password is required.').min(8, 'Use at least 8 characters.');
export const otpSchema = z.string().min(6, 'Enter the 6-digit code.');
