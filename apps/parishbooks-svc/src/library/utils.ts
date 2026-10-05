import type { CookieOptions } from 'express';

export class Utils {
    static slugify(text: string) {
        return text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }

    static getHeader(token: string) {
        const header = new Headers();
        header.set('Authorization', `Bearer ${token}`);
        return header;
    }

    static getCookieOptions(): CookieOptions {
        const secure = process.env.NODE_ENV === 'production';
        const sameSite = process.env.NODE_ENV === 'production' ? 'strict' : 'lax';
        return { httpOnly: true, secure, sameSite };
    }
}
