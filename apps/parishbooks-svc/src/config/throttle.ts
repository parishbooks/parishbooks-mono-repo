import { ConfigType, registerAs } from '@nestjs/config';

export const throttleConfig = registerAs('throttle', () => ({
    ttl: Number(process.env.THROTTLE_TTL ?? '60000'),
    limit: Number(process.env.THROTTLE_LIMIT ?? '100'),
}));

export type ThrottleConfig = ConfigType<typeof throttleConfig>;
