export function dashboardPath(orgSlug: string, suffix = ''): string {
    const clean = suffix.replace(/^\/+/, '').replace(/\/+$/, '');
    return clean ? `/dashboard/${orgSlug}/${clean}` : `/dashboard/${orgSlug}`;
}

export function replaceDashboardOrgSlug(pathname: string, orgSlug: string): string {
    const segments = pathname.split('/');
    if (segments[1] !== 'dashboard' || !segments[2]) return dashboardPath(orgSlug);
    segments[2] = orgSlug;
    return segments.join('/') || dashboardPath(orgSlug);
}

export function defaultOrgSlug(organizations: { id: string; slug?: string }[], activeOrganizationId: string | null): string | null {
    const active = activeOrganizationId ? organizations.find((org) => org.id === activeOrganizationId) : undefined;
    const chosen = active ?? organizations[0];
    if (!chosen) return null;
    return chosen.slug ?? chosen.id;
}
