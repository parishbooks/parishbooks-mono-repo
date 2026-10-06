/* eslint-disable @typescript-eslint/no-explicit-any */
import { type DynamicModule, Global, Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AUTH_GUARD_OPTIONS } from './auth.constants.js';
import { AuthGuard } from './auth.guard.js';
import type { AuthGuardOptions } from './auth.types.js';

@Global()
@Module({})
export class AuthGuardModule {
    static forRootAsync(options: {
        imports?: DynamicModule['imports'];
        inject?: any[];
        useFactory: (...args: any[]) => AuthGuardOptions | Promise<AuthGuardOptions>;
    }): DynamicModule {
        return {
            module: AuthGuardModule,
            imports: options.imports ?? [],
            exports: [AuthGuard, AUTH_GUARD_OPTIONS],
            providers: [
                Reflector,
                AuthGuard,
                { provide: AUTH_GUARD_OPTIONS, useFactory: options.useFactory, inject: options.inject ?? [] },
                { provide: APP_GUARD, useExisting: AuthGuard },
            ],
        };
    }
}
