import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        if (/^\$2[abxy]?\$\d+\$/.test(password)) return password;
        return bcrypt.hash(password, salt);
    }

    async comparePasswords(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}
