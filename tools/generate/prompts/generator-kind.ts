import inquirer from 'inquirer';
import { GENERATORS, type GeneratorKind } from '../config/generators';

export async function promptGeneratorKind(): Promise<GeneratorKind> {
    const { kind } = await inquirer.prompt<{ kind: GeneratorKind }>([
        {
            type: 'select',
            name: 'kind',
            message: 'What would you like to generate?',
            choices: GENERATORS.map((generator) => ({
                name: generator.name,
                value: generator.value,
            })),
        },
    ]);

    return kind;
}
