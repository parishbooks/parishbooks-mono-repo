import 'server-only';

import { safeNextPath } from '@/lib/auth/safe-next-path';

/** UI-only: skips API session lookup until auth integration is wired. */
export async function resolvePostLoginRedirect(next?: string | null): Promise<string> {
    return safeNextPath(next);
}
