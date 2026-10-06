import { cookies } from 'next/headers';

export async function applyUpstreamCookies(response: Response): Promise<void> {
    const cookieStore = await cookies();
    const setCookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
    for (const raw of setCookies) {
        if (!raw.startsWith('pb_')) continue;
        const [pair, ...attributes] = raw.split(';').map((part) => part.trim());
        const separator = pair.indexOf('=');
        if (separator <= 0) continue;
        const name = pair.slice(0, separator);
        const value = pair.slice(separator + 1);
        let maxAge: number | undefined;
        let path = '/';
        let httpOnly = false;
        let secure = false;
        let sameSite: 'lax' | 'strict' | 'none' = 'lax';
        for (const attribute of attributes) {
            const [key, attributeValue = ''] = attribute.split('=').map((p) => p.trim());
            const normalized = key.toLowerCase();
            if (normalized === 'max-age') maxAge = Number(attributeValue);
            else if (normalized === 'path') path = attributeValue || '/';
            else if (normalized === 'httponly') httpOnly = true;
            else if (normalized === 'secure') secure = true;
            else if (normalized === 'samesite') sameSite = attributeValue.toLowerCase() as typeof sameSite;
        }
        if (!value || maxAge === 0) {
            cookieStore.delete(name);
            continue;
        }
        cookieStore.set(name, value, {
            httpOnly,
            secure,
            path,
            sameSite,
            ...(maxAge === undefined ? {} : { maxAge }),
        });
    }
}
