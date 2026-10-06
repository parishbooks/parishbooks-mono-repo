import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: './openapi.json',
    output: 'src/lib/api-client',
    plugins: [
        '@hey-api/typescript',
        { name: '@hey-api/sdk', operations: { methodName: '{{name}}Api' } },
        { name: '@hey-api/client-next', runtimeConfigPath: './src/lib/hey-api' },
    ],
});
