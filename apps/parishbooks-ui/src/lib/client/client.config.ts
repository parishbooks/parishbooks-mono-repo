import { client } from '@parishbooks/api-sdk';
import { cookies } from 'next/headers';

const baseUrl =
    process.env.NEXT_PUBLIC_APP_SVC_URL ?? process.env.APP_SVC_URL ?? process.env.IAM_BASE_URL ?? `http://localhost:${process.env.APP_SVC_PORT ?? '8000'}`;

client.setConfig({
    baseUrl,
    credentials: 'include',
    auth: async () => {
        const cookieStore = await cookies();
        const token = cookieStore.get('pb_access_token')?.value;
        return token ?? undefined;
    },
});
