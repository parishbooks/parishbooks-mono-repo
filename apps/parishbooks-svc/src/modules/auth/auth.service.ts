import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthService {
    constructor(private readonly clsService: ClsService) {}

    async validateJwtPayload(payload: JwtPayload): Promise<JwtPayload> {
        this.clsService.set('userId', payload.sub);
        return payload;
    }

    async signIn(email: string, password: string): Promise<JwtPayload> {
        void email;
        void password;
        throw new Error('Method not implemented.');
    }
}
