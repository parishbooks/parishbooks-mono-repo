import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceHelper } from './helpers/auth-service.helper';
import { HooksModule } from './hooks/hooks.module';

@Module({
    imports: [HooksModule],
    controllers: [AuthController],
    providers: [AuthServiceHelper, AuthService],
})
export class AuthModule {}
