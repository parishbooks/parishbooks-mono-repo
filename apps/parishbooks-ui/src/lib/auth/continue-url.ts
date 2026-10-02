export const POST_LOGIN_CONTINUE_PATH = '/continue';

export function postLoginContinueUrl(next?: string | null): string {
    if (!next?.trim()) return POST_LOGIN_CONTINUE_PATH;
    return `${POST_LOGIN_CONTINUE_PATH}?next=${encodeURIComponent(next.trim())}`;
}
