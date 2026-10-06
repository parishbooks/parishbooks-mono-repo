import { cookies } from 'next/headers';

export async function applyUpstreamCookies(response: Response): Promise<void> {
    const cookieStore = await cookies();
    const setCookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
    for (const raw of setCookies) {
        if (!raw.startsWith('pb_')) continue;
        const [pair] = raw.split(';');
        const separator = pair.indexOf('=');
        if (separator <= 0) continue;
        const name = pair.slice(0, separator);
        const value = pair.slice(separator + 1);
        if (!value) cookieStore.delete(name);
        else cookieStore.set(name, value, { httpOnly: true, path: '/', sameSite: 'lax' });
    }
}
