import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DatabaseModuleAsyncOptions, DatabaseModuleOptions } from './database.types';
import { typeOrmEntities, typeOrmMigrations, typeOrmNamingStrategy } from './typeorm.config';

@Module({})
export class DatabaseModule {
    static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
        return {
            module: DatabaseModule,
            global: true,
            imports: [
                ...(options.imports ?? []),
                TypeOrmModule.forRootAsync({
                    imports: options.imports,
                    inject: options.inject ?? [],
                    useFactory: async (...args: unknown[]) => {
                        const config = await options.useFactory(...args);
                        return this.toTypeOrmOptions(config);
                    },
                }),
            ],
            exports: [TypeOrmModule],
        };
    }

    private static toTypeOrmOptions(config: DatabaseModuleOptions) {
        return {
            type: 'postgres' as const,
            url: config.url,
            entities: typeOrmEntities,
            migrations: typeOrmMigrations,
            autoLoadEntities: false,
            synchronize: false,
            logging: config.logging,
            ssl: config.ssl,
            namingStrategy: typeOrmNamingStrategy,
        };
    }
}
