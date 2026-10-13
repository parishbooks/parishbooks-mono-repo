import { InjectDataSource } from '@nestjs/typeorm';
import { AuthRepository } from '../repository/auth.repository';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { PasswordService } from './password.service';
import { SignUpResponseDto } from '../dto/signup-response.dto';
import { UserAlreadyExistsException } from '../exceptions';
import { VerificationService } from './verification.service';
import { SignUpDto } from '../dto/signup.dto';
import { CreateUserAccountSchema } from '../schema/create-user-account.schema';
import { OtpHelper } from '../helpers/otp.helper';

@Injectable()
export class SignUpService {
    private readonly logger = new Logger(SignUpService.name);

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
        private readonly verificationService: VerificationService,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    private async ensureUniqueUser(email: string, em: EntityManager) {
        const userExists = await this.authRepository.checkUserExists(email, em);
        if (!userExists) return;
        this.logger.error(`User already exists`);
        throw new UserAlreadyExistsException();
    }

    async signUp(dto: SignUpDto) {
        this.logger.log(`Signing up user`);
        const account = CreateUserAccountSchema.parse({ ...dto, email: OtpHelper.normalizeAuthEmail(dto.email) });
        const hashedPassword = await this.passwordService.hash(account.password);
        const response = await this.dataSource.transaction(async (em) => {
            await this.ensureUniqueUser(account.email, em);
            const user = await this.authRepository.createUserAccount({ ...account, password: hashedPassword }, em);
            const redirect = `/verify-email?email=${encodeURIComponent(user.email)}`;
            return { response: new SignUpResponseDto({ userId: user.id, redirectTo: redirect }), email: user.email };
        });
        void this.verificationService.sendEmailVerificationOtp(response.email);
        return response.response;
    }
}
