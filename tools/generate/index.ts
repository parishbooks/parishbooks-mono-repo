import { generateJsLibrary } from './generators/js-library';
import { toKebabCase } from './lib/to-kebab-case';
import { workspaceRootFromImportMeta } from './lib/workspace-root';
import { promptGeneratorKind } from './prompts/generator-kind';
import { promptLibraryName } from './prompts/library-name';

async function main() {
  const workspaceRoot = workspaceRootFromImportMeta(import.meta);

  const kind = await promptGeneratorKind();
  if (kind !== 'js-library') {
    console.error(`Unknown generator: ${kind}`);
    process.exit(1);
  }

  const libraryNameRaw = await promptLibraryName();
  const name = toKebabCase(libraryNameRaw);
  if (!name) {
    console.error('Could not derive a valid library name from that input.');
    process.exit(1);
  }

  if (name !== libraryNameRaw.trim()) console.log(`Using kebab-case name: ${name}`);

  const exitCode = generateJsLibrary(workspaceRoot, name);
  process.exit(exitCode);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
