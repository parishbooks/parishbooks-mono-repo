import { AccountProviderId, User } from '@parishbooks/database';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateUserAccountDto } from '../interfaces';

@Injectable()
export class AuthRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    async checkUserExists(email: string) {
        const user = this.dataSource.getRepository(User);
        const userExists = await user.findOne({ where: { email } });
        return userExists !== null;
    }

    async getUserByEmail(email: string) {
        const userRepository = this.dataSource.getRepository(User);
        return await userRepository.findOne({
            where: { email, accounts: { providerId: AccountProviderId.CREDENTIAL } },
            relations: { accounts: true },
        });
    }

    createUserAccount(dto: CreateUserAccountDto) {
        throw new NotImplementedException(`Sign-up is not implemented for ${dto.email}.`);
    }
}
