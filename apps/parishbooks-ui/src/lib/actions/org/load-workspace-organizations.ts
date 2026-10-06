import { getCurrentSessionApi, listOrganizationsApi } from '@/lib/api-client';

export type WorkspaceOrganization = {
    id: string;
    name: string;
    slug?: string;
};

export type WorkspaceOrganizations = {
    organizations: WorkspaceOrganization[];
    activeOrganizationId: string | null;
};

function activeOrganizationIdFromSession(data: unknown): string | null {
    if (!data || typeof data !== 'object') return null;
    const session = (data as { session?: { activeOrganizationId?: unknown } }).session;
    const id = session?.activeOrganizationId;
    return typeof id === 'string' && id.length > 0 ? id : null;
}

function organizationsFromResponse(data: unknown): WorkspaceOrganization[] {
    if (!Array.isArray(data)) return [];
    const organizations: WorkspaceOrganization[] = [];
    for (const item of data) {
        if (!item || typeof item !== 'object') continue;
        const org = item as { id?: unknown; name?: unknown; slug?: unknown };
        if (typeof org.id !== 'string' || !org.id) continue;
        if (typeof org.name !== 'string' || !org.name) continue;
        organizations.push({
            id: org.id,
            name: org.name,
            ...(typeof org.slug === 'string' ? { slug: org.slug } : {}),
        });
    }
    return organizations;
}

export async function loadWorkspaceOrganizations(): Promise<WorkspaceOrganizations | null> {
    const [currentSessionData, organizationsData] = await Promise.all([getCurrentSessionApi(), listOrganizationsApi()]);
    const { data: session, error: sessionError } = currentSessionData;
    const { data: organizations, error: orgsError } = organizationsData;
    if (sessionError || orgsError) return null;
    return { organizations: organizationsFromResponse(organizations), activeOrganizationId: activeOrganizationIdFromSession(session) };
}
