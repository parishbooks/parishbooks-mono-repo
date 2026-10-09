import z from 'zod';

export const JwtPayloadSchema = z.object({
    sub: z.string().describe("The authenticated user's id."),
    iss: z.string().optional().describe('The issuer of the JWT.'),
    aud: z.string().optional().describe('The audience of the JWT.'),
    iat: z.number().describe('The issued at time of the JWT.'),
    exp: z.number().describe('The expiration time of the JWT.'),
});
