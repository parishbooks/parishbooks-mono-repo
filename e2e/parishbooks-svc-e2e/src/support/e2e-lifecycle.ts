import { waitForPortOpen } from '@nx/node/utils';
import { E2eEnvironment } from './e2e-environment';

declare global {
    var __TEARDOWN_MESSAGE__: string | undefined;
}

export class E2eLifecycle {
    static async setup(): Promise<void> {
        E2eEnvironment.loadEnv();
        console.log('\nSetting up...\n');
        await waitForPortOpen(E2eEnvironment.portNumber, { host: E2eEnvironment.host });
        globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
    }

    static async teardown(): Promise<void> {
        // Nx stops the continuous `serve` dependency; do not killPort here or the executor restarts and e2e exits non-zero.
        console.log(globalThis.__TEARDOWN_MESSAGE__);
    }
}
