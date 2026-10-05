export type DefineThrottlerProps = {
    ttl: number;
    limit: number;
    name?: string;
};

export const defineThrottler = ({ ttl, limit, name = 'default' }: DefineThrottlerProps) => ({
    throttlers: [{ name, ttl, limit }],
});
