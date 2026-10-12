import { registerAs, ConfigType } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
    secret: process.env.AUTH_SECRET,
    jwt: { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN },
}));

export type AuthConfig = ConfigType<typeof authConfig>;
