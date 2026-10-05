import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceHelper } from './helpers/auth-service.helper';

@Module({
    controllers: [AuthController],
    providers: [AuthServiceHelper, AuthService],
})
export class AuthModule {}
