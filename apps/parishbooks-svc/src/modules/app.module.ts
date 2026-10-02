import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommunicationsModule } from '@parishbooks/communications';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), CommunicationsModule.forRootAsync(), AuthModule],
})
export class AppModule {}
