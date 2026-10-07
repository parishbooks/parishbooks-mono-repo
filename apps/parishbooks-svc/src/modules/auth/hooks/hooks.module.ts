import { Module } from '@nestjs/common';
import { SessionHook } from './session/session.hook';

@Module({ providers: [SessionHook], exports: [SessionHook] })
export class HooksModule {}
