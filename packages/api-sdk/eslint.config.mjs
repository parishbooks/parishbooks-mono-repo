import baseConfig from '../../eslint.config.mjs';

export default [
    {
        ignores: ['**/out-tsc', 'src/lib/**'],
    },
    ...baseConfig,
    {
        files: ['**/*.json'],
        rules: {
            '@nx/dependency-checks': [
                'error',
                {
                    ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}', '{projectRoot}/vitest.config.{js,ts,mjs,mts}'],
                },
            ],
        },
        languageOptions: {
            parser: await import('jsonc-eslint-parser'),
        },
    },
];
