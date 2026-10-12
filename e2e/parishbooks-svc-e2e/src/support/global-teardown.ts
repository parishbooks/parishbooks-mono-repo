import { E2eLifecycle } from './e2e-lifecycle';

export async function teardown() {
    await E2eLifecycle.teardown();
}
