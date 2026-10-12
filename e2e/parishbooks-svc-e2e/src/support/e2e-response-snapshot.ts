import { expect } from 'vitest';

const UUID_PATTERN = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
const JWT_PATTERN = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
const ISO_TIMESTAMP_PATTERN = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g;
const E2E_EMAIL_PATTERN = /[a-z0-9.-]+@e2e\.parishbooks\.test/gi;

/** Vitest `toMatchSnapshot` helpers for HTTP JSON (redacts ids, tokens, timestamps). */
export class E2eResponseSnapshot {
    static expectSnapshot(value: unknown, snapshotName?: string): void {
        const normalized = this.normalize(value);
        if (snapshotName) expect(normalized).toMatchSnapshot(snapshotName);
        else expect(normalized).toMatchSnapshot();
    }

    static expectSetCookies(setCookie: string[] | string | undefined, snapshotName?: string): void {
        const cookies = this.normalizeSetCookieHeader(setCookie);
        if (snapshotName) expect(cookies).toMatchSnapshot(snapshotName);
        else expect(cookies).toMatchSnapshot();
    }

    static normalize(value: unknown): unknown {
        if (value === null || value === undefined) return value;
        if (typeof value === 'string') return this.normalizeString(value);
        if (Array.isArray(value)) return value.map((entry) => this.normalize(entry));
        if (typeof value === 'object') {
            const record = value as Record<string, unknown>;
            const out: Record<string, unknown> = {};
            for (const [key, nested] of Object.entries(record)) out[key] = this.normalize(nested);
            return out;
        }
        return value;
    }

    private static normalizeString(value: string): string {
        return value
            .replace(JWT_PATTERN, '<jwt>')
            .replace(UUID_PATTERN, '<uuid>')
            .replace(ISO_TIMESTAMP_PATTERN, '<timestamp>')
            .replace(E2E_EMAIL_PATTERN, '<email>')
            .replace(/email=[^;&]+/g, 'email=<email>');
    }

    private static normalizeSetCookieHeader(setCookie: string[] | string | undefined): string[] {
        if (!setCookie) return [];
        const list = Array.isArray(setCookie) ? setCookie : [setCookie];
        return list.map((cookie) => {
            const [nameValue] = cookie.split(';');
            const eq = nameValue?.indexOf('=') ?? -1;
            if (eq <= 0) return cookie;
            const name = nameValue.slice(0, eq);
            return `${name}=<redacted>`;
        });
    }
}
