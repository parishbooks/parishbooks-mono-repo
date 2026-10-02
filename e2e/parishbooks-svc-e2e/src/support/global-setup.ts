import { waitForPortOpen } from '@nx/node/utils';

declare global {
    // eslint-disable-next-line no-var
    var __TEARDOWN_MESSAGE__: string | undefined;
}

export async function setup() {
    console.log('\nSetting up...\n');

    const host = process.env.HOST ?? 'localhost';
    const port = Number(process.env.APP_SVC_PORT ?? process.env.PORT ?? 8000);
    await waitForPortOpen(port, { host });

    globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
}
