export default {
    input: 'http://localhost:8000/api/docs-json',
    output: 'src/lib',
    plugins: [{ name: '@hey-api/client-next', runtimeConfigPath: '../src/api.config.ts' }],
};
