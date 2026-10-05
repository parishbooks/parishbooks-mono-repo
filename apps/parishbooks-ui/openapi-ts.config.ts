import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: process.env.OPENAPI_INPUT ?? './openapi.json',
    output: 'src/lib/api-client',
    plugins: [
        '@hey-api/typescript',
        '@hey-api/sdk',
        {
            name: '@hey-api/client-next',
            runtimeConfigPath: './src/lib/hey-api',
        },
    ],
});
