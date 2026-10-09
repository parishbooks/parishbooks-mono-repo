import { registerAs } from '@nestjs/config';

export default registerAs('iam', () => ({
    secret: process.env.IAM_SECRET,
    baseUrl: process.env.IAM_BASE_URL,
}));
