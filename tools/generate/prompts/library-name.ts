import inquirer from 'inquirer';

export async function promptLibraryName(): Promise<string> {
    const { libraryNameRaw } = await inquirer.prompt<{ libraryNameRaw: string }>([
        {
            type: 'input',
            name: 'libraryNameRaw',
            message: 'Library name:',
            validate: (value: string) => (value.trim().length > 0 ? true : 'Enter a library name'),
        },
    ]);

    return libraryNameRaw;
}
