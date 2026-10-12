import { Account, AccountProviderId, Tenant, User } from '@parishbooks/database';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserAccountDto } from '../interfaces';

@Injectable()
export class AuthRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    async checkUserExists(email: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const user = em.getRepository(User);
        const userExists = await user.findOne({ where: { email } });
        return userExists !== null;
    }

    async getUserByEmail(email: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const user = em.getRepository(User);
        return await user.findOne({
            where: { email, accounts: { providerId: AccountProviderId.CREDENTIAL } },
            relations: { accounts: true },
        });
    }

    async getUserById(id: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const user = em.getRepository(User);
        return await user.findOne({ where: { id } });
    }

    async markEmailVerified(userId: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const user = em.getRepository(User);
        await user.update({ id: userId }, { emailVerified: true });
    }

    private async createTenant(name: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const tenant = em.create(Tenant, { name });
        return await em.save(tenant);
    }

    private async createUser(data: Partial<User>, tenant: Tenant, em: EntityManager = this.dataSource.createEntityManager()) {
        const user = em.create(User, { ...data, tenantId: tenant.id });
        return await em.save(user);
    }

    private async createAccount(data: Partial<User>, password: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const account = em.create(Account, { providerId: AccountProviderId.CREDENTIAL, userId: data.id, password });
        return await em.save(account);
    }

    async createUserAccount(dto: CreateUserAccountDto, em: EntityManager = this.dataSource.createEntityManager()) {
        const tenant = await this.createTenant(dto.email, em);
        const user = await this.createUser({ name: `${dto.firstName} ${dto.lastName}`, email: dto.email }, tenant, em);
        const account = await this.createAccount(user, dto.password, em);
        return { tenant, user, account };
    }
}
