export interface JwtPayload {
    sub: string;
    iss?: string;
    aud?: string;
    iat: number;
    exp: number;
}
