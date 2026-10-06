#!/usr/bin/env bun
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import inquirer from 'inquirer';

function toPascalCase(value: string): string {
    return value
        .trim()
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

async function main() {
    const argName = process.argv.slice(2).join(' ').trim();
    const name =
        argName ||
        (
            await inquirer.prompt<{ name: string }>([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Migration name (e.g. Add Organization Profile):',
                    validate: (value: string) => (toPascalCase(value).length > 0 ? true : 'Name must contain at least one letter or number'),
                },
            ])
        ).name;

    const migrationName = toPascalCase(name);
    const workspaceRoot = resolve(import.meta.dir, '../../..');
    const packageRoot = resolve(import.meta.dir, '..');

    const build = spawnSync('bun', ['nx', 'run', '@parishbooks/database:build'], {
        cwd: workspaceRoot,
        stdio: 'inherit',
        env: process.env,
    });
    if (build.status !== 0) process.exit(build.status ?? 1);

    // Generate against the compiled data source (Bun's decorator emit breaks TypeORM metadata).
    const result = spawnSync('bunx', ['typeorm', 'migration:generate', '-d', 'dist/data-source.js', `src/lib/migrations/${migrationName}`], {
        cwd: packageRoot,
        stdio: 'inherit',
        env: process.env,
    });

    process.exit(result.status ?? 1);
}

void main();
