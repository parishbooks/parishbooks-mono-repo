import { waitForPortOpen } from '@nx/node/utils';

declare global {
  // eslint-disable-next-line no-var
  var __TEARDOWN_MESSAGE__: string | undefined;
}

export async function setup() {
  console.log('\nSetting up...\n');

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await waitForPortOpen(port, { host });

  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
}
