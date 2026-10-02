import { spawnSync } from 'node:child_process';

export function generateNestLibrary(workspaceRoot: string, name: string): number {
  const directory = `packages/${name}`;
  const importPath = `@parishbooks/${name}`;
  const nxProjectName = importPath;

  const args = [
    'nx',
    'generate',
    '@nx/nest:library',
    `--directory=${directory}`,
    `--importPath=${importPath}`,
    '--linter=eslint',
    `--name=${nxProjectName}`,
    '--unitTestRunner=vitest',
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
