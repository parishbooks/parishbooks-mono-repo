import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Workspace root from `tools/generate/index.ts` (or any file under `tools/generate/`). */
export function workspaceRootFromImportMeta(meta: ImportMeta): string {
    const generateDir = path.dirname(fileURLToPath(meta.url));
    return path.resolve(generateDir, '../..');
}
