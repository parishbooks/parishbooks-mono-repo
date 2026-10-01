import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/e2e/parishbooks-svc-e2e',
  test: {
    name: '@parishbooks/parishbooks-svc-e2e',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    passWithNoTests: true,
    reporters: ['default'],
    globalSetup: ['./src/support/global-setup.ts'],
    globalTeardown: ['./src/support/global-teardown.ts'],
    setupFiles: ['./src/support/test-setup.ts'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
