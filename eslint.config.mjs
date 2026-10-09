import nx from '@nx/eslint-plugin';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: [
            '**/dist',
            '**/out-tsc',
            '**/vitest.config.*.timestamp*',
            '**/test-output',
            '**/api-client/**',
            'packages/api-sdk/src/lib/**',
            '**/next-env.d.ts',
        ],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
                    depConstraints: [
                        {
                            sourceTag: 'scope:parishbooks-ui',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                        {
                            sourceTag: 'scope:server',
                            notDependOnLibsWithTags: ['scope:parishbooks-ui'],
                        },
                        {
                            sourceTag: 'scope:shared',
                            notDependOnLibsWithTags: ['scope:parishbooks-ui'],
                        },
                        {
                            sourceTag: 'type:ui',
                            notDependOnLibsWithTags: ['scope:parishbooks-ui'],
                        },
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            regex: String.raw`^\.\.?/.+\.(?:[cm]?ts|tsx|jsx)$`,
                            message: 'Use extensionless relative imports (not .ts/.tsx).',
                        },
                    ],
                },
            ],
        },
    },
];
