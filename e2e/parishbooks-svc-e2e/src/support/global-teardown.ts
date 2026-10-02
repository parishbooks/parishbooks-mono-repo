import { killPort } from '@nx/node/utils';

export async function teardown() {
    const port = Number(process.env.APP_SVC_PORT ?? process.env.PORT ?? 8000);
    await killPort(port);
    console.log(globalThis.__TEARDOWN_MESSAGE__);
}
