import type { ErrorResponseDto } from '@/lib/api-client';

export function errorMessage(error: ErrorResponseDto | undefined, fallback: string): string {
    if (!error?.message) return fallback;
    return Array.isArray(error.message) ? error.message.join(' ') : error.message;
}
