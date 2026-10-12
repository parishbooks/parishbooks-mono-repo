import { InjectDataSource } from '@nestjs/typeorm';
import { CreateUserAccountDto } from '../interfaces';
import { AuthRepository } from '../repository/auth.repository';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { PasswordService } from './password.service';
import { SignUpResponseDto } from '../dto/signup-response.dto';
import { UserAlreadyExistsException } from '../exceptions';

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
        throw new UserAlreadyExistsException();
    }

    async signUp(dto: CreateUserAccountDto) {
        this.logger.log(`Signing up user`);
        const hashedPassword = await this.passwordService.hash(dto.password);
        return await this.dataSource.transaction(async (em) => {
            await this.ensureUniqueUser(dto.email, em);
            const result = await this.authRepository.createUserAccount({ ...dto, password: hashedPassword }, em);
            const redirect = `/verify-email?email=${encodeURIComponent(result.user.email)}`;
            return new SignUpResponseDto({ tenantId: result.tenant.id, userId: result.user.id, redirectTo: redirect });
        });
    }
}
