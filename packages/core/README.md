# @parishbooks/core

Shared Nest platform primitives for ParishBooks services.

## Includes

- `Application.init` / `Application.bootstrap` — common service bootstrap
- Logger (`defineLogger`, `LoggerModule`) + correlation IDs
- Helmet (`defineHelmet`), Swagger (`setupSwagger`), throttling (`defineThrottler`)
- Health module, global exception filter, shared env schema fragments

## Bootstrap example

```ts
import { Application } from '@parishbooks/core';
import { AppModule } from './modules/app.module';

void Application.bootstrap({
    module: AppModule,
    port: Number(process.env.APP_SVC_PORT),
    corsOrigin: process.env.APP_UI_URL,
    swagger: { title: 'My Service API', tags: [{ name: 'health' }] },
});
```
