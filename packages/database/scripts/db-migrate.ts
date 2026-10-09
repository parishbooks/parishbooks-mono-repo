#!/usr/bin/env bun
import { spawnSync } from 'node:child_process';
import { databaseScriptPaths } from './lib/paths';
import { pruneCompiledMigrations } from './lib/prune-compiled-migrations';

async function main() {
    const { workspaceRoot, packageRoot } = databaseScriptPaths(import.meta);

    const build = spawnSync('bun', ['nx', 'run', '@parishbooks/database:build', '--skipNxCache'], {
        cwd: workspaceRoot,
        stdio: 'inherit',
        env: process.env,
    });
    if (build.status !== 0) process.exit(build.status ?? 1);

    pruneCompiledMigrations(packageRoot);

    const result = spawnSync('bunx', ['typeorm', 'migration:run', '-d', 'dist/data-source.js'], {
        cwd: packageRoot,
        stdio: 'inherit',
        env: process.env,
    });
    process.exit(result.status ?? 1);
}

void main();
