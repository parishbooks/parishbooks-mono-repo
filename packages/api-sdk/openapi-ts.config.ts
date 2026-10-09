export default {
    input: 'http://localhost:8000/api/docs-json',
    output: 'src/lib',
    plugins: [
        { name: '@hey-api/typescript' },
        { name: '@hey-api/client-next', runtimeConfigPath: './src/api.config.ts' },
        { name: '@hey-api/sdk', auth: true, operations: { strategy: 'single', containerName: 'ApiSdk' } },
    ],
};
