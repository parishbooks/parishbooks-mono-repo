import { generateJsLibrary } from './generators/js-library';
import { generateNestLibrary } from './generators/nest-library';
import { toKebabCase } from './lib/to-kebab-case';
import { workspaceRootFromImportMeta } from './lib/workspace-root';
import { promptGeneratorKind } from './prompts/generator-kind';
import { promptLibraryName } from './prompts/library-name';

async function main() {
    const workspaceRoot = workspaceRootFromImportMeta(import.meta);

    const kind = await promptGeneratorKind();
    const libraryNameRaw = await promptLibraryName();
    const name = toKebabCase(libraryNameRaw);
    if (!name) {
        console.error('Could not derive a valid library name from that input.');
        process.exit(1);
    }

    if (name !== libraryNameRaw.trim()) console.log(`Using kebab-case name: ${name}`);

    let exitCode = 1;
    if (kind === 'js-library') exitCode = generateJsLibrary(workspaceRoot, name);
    else if (kind === 'nest-library') exitCode = generateNestLibrary(workspaceRoot, name);
    else {
        console.error(`Unknown generator: ${kind}`);
        process.exit(1);
    }

    process.exit(exitCode);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
