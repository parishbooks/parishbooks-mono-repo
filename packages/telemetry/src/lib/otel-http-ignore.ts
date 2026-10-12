/** Path substrings skipped for incoming HTTP trace spans (and span-derived APM metrics). */
const DEFAULT_IGNORED_INCOMING_HTTP_PATH_PREFIXES = ['/health', '/metrics', '/api/docs'];

const ignoredIncomingHttpPathPrefixes = (): string[] => {
    const fromEnv = process.env.OTEL_HTTP_TRACE_IGNORE_PREFIXES;
    if (fromEnv === undefined) return DEFAULT_IGNORED_INCOMING_HTTP_PATH_PREFIXES;
    const parsed = fromEnv
        .split(',')
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0);
    return parsed.length > 0 ? parsed : DEFAULT_IGNORED_INCOMING_HTTP_PATH_PREFIXES;
};

export const shouldIgnoreIncomingHttpTrace = (url: string | undefined): boolean => {
    if (typeof url !== 'string') return false;
    const path = url.split('?')[0] ?? url;
    return ignoredIncomingHttpPathPrefixes().some((prefix) => path.includes(prefix));
};
