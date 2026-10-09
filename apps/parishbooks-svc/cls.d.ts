/* eslint-disable @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
import 'nestjs-cls';

/** Extend `ClsStore` here when adding request-scoped keys for parishbooks-svc. */
declare module 'nestjs-cls' {
    interface ClsStore {}
}
