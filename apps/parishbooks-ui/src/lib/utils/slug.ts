const SLUG_MAX_LENGTH = 48;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugFromName(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, SLUG_MAX_LENGTH)
        .replace(/-+$/g, '');
}

export function isValidSlug(slug: string): boolean {
    return SLUG_PATTERN.test(slug) && slug.length <= SLUG_MAX_LENGTH;
}

export function isValidChurchName(name: string): boolean {
    return name.trim().length >= 2;
}
