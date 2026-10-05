#!/usr/bin/env bun
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

async function main() {
    const build = spawnSync('bun', ['nx', 'run', '@parishbooks/database:build'], {
        cwd: resolve(import.meta.dir, '../../..'),
        stdio: 'inherit',
        env: process.env,
    });
    if (build.status !== 0) process.exit(build.status ?? 1);

    const result = spawnSync('bunx', ['typeorm', 'migration:run', '-d', 'dist/data-source.js'], {
        cwd: resolve(import.meta.dir, '..'),
        stdio: 'inherit',
        env: process.env,
    });
    process.exit(result.status ?? 1);
}

void main();
