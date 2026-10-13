import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../dto/auth-user.dto';
import { JWT_TOKEN_TYPE_ACCESS, JWT_TOKEN_TYPE_REFRESH } from '../constants/jwt.constant';
import { RefreshTokenInvalidException } from '../exceptions';
import { AuthRepository } from '../repository/auth.repository';
import { SignInService } from './signin.service';
import { User } from '@parishbooks/database';
import { toAuthUser } from '../helpers/auth-user.mapper';

type RefreshJwtPayload = {
    sub: string;
    typ?: string;
};

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authRepository: AuthRepository,
        private readonly signInService: SignInService,
    ) {}

    mintTokenPair(user: AuthUser, rememberMe?: boolean) {
        const accessToken = this.mintAccessToken(user);
        const refreshToken = this.mintRefreshToken(user.id, rememberMe);
        return { accessToken, refreshToken };
    }

    mintAccessToken({ id, ...user }: AuthUser): string {
        return this.jwtService.sign({ sub: id, typ: JWT_TOKEN_TYPE_ACCESS, ...user });
    }

    mintRefreshToken(userId: string, rememberMe?: boolean): string {
        const expiresIn = rememberMe ? '30d' : '7d';
        return this.jwtService.sign({ sub: userId, typ: JWT_TOKEN_TYPE_REFRESH }, { expiresIn });
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = this.jwtService.verify<RefreshJwtPayload>(refreshToken);
            if (payload.typ !== JWT_TOKEN_TYPE_REFRESH || !payload.sub) throw new RefreshTokenInvalidException();
            const user = await this.authRepository.getUserById(payload.sub);
            if (!user) throw new RefreshTokenInvalidException();
            const authUser = this.toAuthUser(user);
            this.signInService.validateUser(authUser);
            return { accessToken: this.mintAccessToken(authUser) };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new RefreshTokenInvalidException();
        }
    }

    private toAuthUser(user: User): AuthUser {
        return toAuthUser(user);
    }
}
