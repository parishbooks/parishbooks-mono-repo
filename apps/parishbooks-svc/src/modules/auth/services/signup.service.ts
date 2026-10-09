import { CreateUserAccountDto } from '../interfaces';
import { AuthRepository } from '../repository/auth.repository';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SignUpService {
    private readonly logger = new Logger(SignUpService.name);
    constructor(private readonly authRepository: AuthRepository) {}

    private async ensureUniqueUser(email: string) {
        const userExists = await this.authRepository.checkUserExists(email);
        if (!userExists) return;
        this.logger.error(`User already exists`);
        throw new BadRequestException('User already exists');
    }

    async signUp(dto: CreateUserAccountDto) {
        this.logger.log(`Signing up user`);
        await this.ensureUniqueUser(dto.email);
        return this.authRepository.createUserAccount(dto);
    }
}
