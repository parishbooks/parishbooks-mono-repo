import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { SignInService } from '../services/signin.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly signInService: SignInService) {
        super({ usernameField: 'email', passReqToCallback: false, session: false });
    }

    async validate(email: string, password: string) {
        return this.signInService.signIn(email, password);
    }
}
