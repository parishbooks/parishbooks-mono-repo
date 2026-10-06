import { NextResponse, type NextRequest } from 'next/server';
import { createClient, createConfig } from '@/lib/api-client/client';
import { setActiveOrganizationApi } from '@/lib/api-client';
import { safeNextPath } from '@/lib/auth/safe-next-path';
import { svcBaseUrl } from '@/lib/auth/verify-access-token';

const activateClient = createClient(createConfig({ baseUrl: svcBaseUrl }));

/** Activate an org (sets auth cookies) then redirect — safe outside RSC render. */
export async function GET(request: NextRequest) {
    const organizationId = request.nextUrl.searchParams.get('organizationId');
    const next = safeNextPath(request.nextUrl.searchParams.get('next'), '/dashboard');
    if (!organizationId) return NextResponse.redirect(new URL('/dashboard', request.url));

    const cookie = request.headers.get('cookie') ?? '';
    const { response, error } = await setActiveOrganizationApi({
        client: activateClient,
        headers: { cookie },
        body: { organizationId: organizationId as never },
    });

    if (error || !response?.ok) return NextResponse.redirect(new URL('/dashboard', request.url));

    const redirectResponse = NextResponse.redirect(new URL(next, request.url));
    const setCookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
    for (const value of setCookies) redirectResponse.headers.append('Set-Cookie', value);
    return redirectResponse;
}
