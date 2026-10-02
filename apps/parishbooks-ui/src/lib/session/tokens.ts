'use server';

export async function getAccessToken(): Promise<string | undefined> {
    return undefined;
}

export async function setAccessToken(_token: string): Promise<void> {}

export async function deleteAccessToken(): Promise<void> {}

export async function deleteRefreshToken(): Promise<void> {}
