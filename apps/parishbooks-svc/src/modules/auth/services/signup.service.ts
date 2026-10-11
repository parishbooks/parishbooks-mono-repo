import { InjectDataSource } from '@nestjs/typeorm';
import { CreateUserAccountDto } from '../interfaces';
import { AuthRepository } from '../repository/auth.repository';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { PasswordService } from './password.service';
import { SignUpResponseDto } from '../dto/signup-response.dto';
import { User } from '@parishbooks/database';

@Injectable()
export class SignUpService {
    private readonly logger = new Logger(SignUpService.name);

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    private async ensureUniqueUser(email: string, em: EntityManager) {
        const userExists = await this.authRepository.checkUserExists(email, em);
        if (!userExists) return;
        this.logger.error(`User already exists`);
        throw new BadRequestException('User already exists');
    }

    private async determineRedirect(user: User): Promise<string> {
        if (!user.emailVerified) return '/verify-email?token=' + user.email;
        if (user.banned) return '/banned';
        return '/dashboard';
    }

    async signUp(dto: CreateUserAccountDto) {
        this.logger.log(`Signing up user`);
        const hashedPassword = await this.passwordService.hashPassword(dto.password);
        return await this.dataSource.transaction(async (em) => {
            await this.ensureUniqueUser(dto.email, em);
            const result = await this.authRepository.createUserAccount({ ...dto, password: hashedPassword }, em);
            const redirect = await this.determineRedirect(result.user);
            return SignUpResponseDto.success({ tenantId: result.tenant.id, userId: result.user.id }, redirect);
        });
    }
}
