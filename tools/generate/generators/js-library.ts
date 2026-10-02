import { spawnSync } from 'node:child_process';

export function generateJsLibrary(workspaceRoot: string, name: string): number {
  const directory = `packages/${name}`;
  const importPath = `@parishbooks/${name}`;
  const nxProjectName = importPath;

  const args = [
    'nx',
    'generate',
    '@nx/js:library',
    `--directory=${directory}`,
    `--importPath=${importPath}`,
    '--bundler=tsc',
    '--linter=eslint',
    `--name=${nxProjectName}`,
    '--unitTestRunner=vitest',
    '--formatter=prettier',
    '--useProjectJson=true',
    '--no-interactive',
  ];

  console.log(`\nRunning: bun ${args.join(' ')}\n`);

  const result = spawnSync('bun', args, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: process.env,
  });

  return result.status ?? 1;
}
