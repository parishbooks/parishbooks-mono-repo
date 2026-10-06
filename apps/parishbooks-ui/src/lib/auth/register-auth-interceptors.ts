import { clearSession } from '@/lib/actions/auth/clear-session';
import { isPublicAuthApiRequest } from '@/lib/auth/public-auth-api';
import { client } from '@/lib/api-client/client.gen';

let registered = false;

/** Register once: any authenticated API 401 clears cookies and sends the user to sign-in. */
export function registerAuthInterceptors(): void {
    if (registered) return;
    registered = true;

    client.interceptors.response.use(async (response, options) => {
        if (response.status !== 401) return response;
        if (isPublicAuthApiRequest(options.url)) return response;
        await clearSession();
        return response;
    });
}

registerAuthInterceptors();
