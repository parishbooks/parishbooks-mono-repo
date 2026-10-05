import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from '@nestjs/common';
import type { LoggerOptions } from 'typeorm';

// entities / migrations / synchronize are fixed by DatabaseModule.
export type DatabaseModuleOptions = {
    url: string;
    logging?: LoggerOptions;
    ssl?: boolean | object;
};

export type DatabaseModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => DatabaseModuleOptions | Promise<DatabaseModuleOptions>;
};
