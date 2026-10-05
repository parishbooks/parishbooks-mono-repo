import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const npmScope = 'parishbooks';

function toPascalCase(kebab: string): string {
    return kebab
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function ensureScopedProjectName(workspaceRoot: string, name: string, importPath: string): void {
    const projectJsonPath = join(workspaceRoot, 'packages', name, 'project.json');
    if (!existsSync(projectJsonPath)) return;

    const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf8')) as { name?: string; [key: string]: unknown };
    if (projectJson.name === importPath) return;

    projectJson.name = importPath;
    writeFileSync(projectJsonPath, `${JSON.stringify(projectJson, null, 4)}\n`);
}

function stripScopeFromGeneratedClasses(workspaceRoot: string, name: string): void {
    const libDir = join(workspaceRoot, 'packages', name, 'src', 'lib');
    if (!existsSync(libDir)) return;

    const className = toPascalCase(name);
    const scopedClassName = `${toPascalCase(npmScope)}${className}`;
    if (scopedClassName === className) return;

    for (const suffix of ['.module.ts', '.service.ts', '.service.spec.ts', '.controller.ts', '.controller.spec.ts']) {
        const filePath = join(libDir, `${name}${suffix}`);
        if (!existsSync(filePath)) continue;
        const contents = readFileSync(filePath, 'utf8');
        if (!contents.includes(scopedClassName)) continue;
        writeFileSync(filePath, contents.replaceAll(scopedClassName, className));
    }
}

export function generateNestLibrary(workspaceRoot: string, name: string): number {
    const directory = `packages/${name}`;
    const importPath = `@${npmScope}/${name}`;

    // Use the short library name so Nest class names are `DatabaseModule`, not `ParishbooksDatabaseModule`.
    const args = [
        'nx',
        'generate',
        '@nx/nest:library',
        `--directory=${directory}`,
        `--importPath=${importPath}`,
        '--buildable',
        '--linter=eslint',
        `--name=${name}`,
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

    const exitCode = result.status ?? 1;
    if (exitCode !== 0) return exitCode;

    ensureScopedProjectName(workspaceRoot, name, importPath);
    stripScopeFromGeneratedClasses(workspaceRoot, name);

    return 0;
}
