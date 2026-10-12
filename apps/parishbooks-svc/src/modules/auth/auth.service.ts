import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces';
import { ClsService } from 'nestjs-cls';
import { AuthRepository } from './repository/auth.repository';
import { SignInService } from './services/signin.service';
import { AuthUser } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly clsService: ClsService,
        private readonly authRepository: AuthRepository,
        private readonly signInService: SignInService,
    ) {}

    async validateJwtPayload(payload: JwtPayload): Promise<JwtPayload> {
        const user = await this.authRepository.getUserById(payload.sub);
        if (!user) throw new UnauthorizedException();
        this.signInService.validateUser(new AuthUser({ ...user, roles: [] }));
        this.clsService.set('userId', payload.sub);
        return payload;
    }
}
