import { client } from '@parishbooks/api-sdk';
import { cookies } from 'next/headers';

const baseUrl =
    process.env.NEXT_PUBLIC_APP_SVC_URL ?? process.env.APP_SVC_URL ?? process.env.IAM_BASE_URL ?? `http://localhost:${process.env.APP_SVC_PORT ?? '8000'}`;

client.setConfig({
    baseUrl: baseUrl,
    credentials: 'include',
    auth: async (scheme) => {
        const store = await cookies();
        const name = scheme.name ?? 'Authorization';
        return store.get(name)?.value;
    },
});
