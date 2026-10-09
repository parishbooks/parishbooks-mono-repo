import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function databaseScriptPaths(meta: ImportMeta) {
    const scriptDir = dirname(fileURLToPath(meta.url));
    const packageRoot = resolve(scriptDir, '..');
    const workspaceRoot = resolve(scriptDir, '../../..');
    return { scriptDir, packageRoot, workspaceRoot };
}
