/** Local credential hash stored in `verification` until auth moves to the provider (ER_DESIGN §4 user). */
export const LOCAL_CREDENTIAL_IDENTIFIER = (userId: string): string => `credential:${userId}`;

/** Far-future expiry for non-OTP credential rows. */
export const LOCAL_CREDENTIAL_EXPIRES_AT = new Date('2099-01-01T00:00:00.000Z');
