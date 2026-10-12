import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

/** Remove compiled migration artifacts whose `.ts` source was deleted (tsc does not prune `dist/`). */
export function pruneCompiledMigrations(packageRoot: string): void {
    const srcDir = join(packageRoot, 'src/lib/migrations');
    const distDir = join(packageRoot, 'dist/lib/migrations');

    let srcStems: Set<string>;
    try {
        srcStems = new Set(
            readdirSync(srcDir)
                .filter((name) => name.endsWith('.ts'))
                .map((name) => name.slice(0, -'.ts'.length)),
        );
    } catch {
        return;
    }

    let distFiles: string[];
    try {
        distFiles = readdirSync(distDir);
    } catch {
        return;
    }

    for (const file of distFiles) {
        const stem = file.replace(/(\.d\.ts\.map|\.d\.ts|\.js\.map|\.js)$/, '');
        if (srcStems.has(stem)) continue;
        unlinkSync(join(distDir, file));
    }
}
