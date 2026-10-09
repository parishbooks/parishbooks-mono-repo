export function dashboardPath(orgSlug: string, suffix = ''): string {
    const clean = suffix.replace(/^\/+/, '').replace(/\/+$/, '');
    return clean ? `/dashboard/${orgSlug}/${clean}` : `/dashboard/${orgSlug}`;
}

export function orgSlugFromPathname(pathname: string): string | null {
    const segments = pathname.split('/');
    if (segments[1] !== 'dashboard' || !segments[2]) return null;
    return segments[2];
}

export function replaceDashboardOrgSlug(pathname: string, orgSlug: string): string {
    const segments = pathname.split('/');
    if (segments[1] !== 'dashboard' || !segments[2]) return dashboardPath(orgSlug);
    segments[2] = orgSlug;
    return segments.join('/') || dashboardPath(orgSlug);
}
