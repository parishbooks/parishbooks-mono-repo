import { Client, Profile, User, UserStatus, Verification } from '@parishbooks/database';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserAccountDto } from '../interfaces';
import { LOCAL_CREDENTIAL_EXPIRES_AT, LOCAL_CREDENTIAL_IDENTIFIER } from '../helpers/credential-identifier.helper';

@Injectable()
export class AuthRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    async checkUserExists(email: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const user = em.getRepository(User);
        const userExists = await user.findOne({ where: { email }, withDeleted: true });
        return userExists !== null;
    }

    async getUserByEmail(email: string, em: EntityManager = this.dataSource.createEntityManager()) {
        return await this.loadUserWithProfile({ email }, em);
    }

    async getUserById(id: string, em: EntityManager = this.dataSource.createEntityManager()) {
        return await this.loadUserWithProfile({ id }, em);
    }

    async getCredentialHash(userId: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const verification = em.getRepository(Verification);
        const row = await verification.findOne({ where: { identifier: LOCAL_CREDENTIAL_IDENTIFIER(userId) } });
        return row?.value;
    }

    async markEmailVerified(userId: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const user = em.getRepository(User);
        await user.update({ id: userId }, { status: UserStatus.ACTIVE });
    }

    async updateCredentialPassword(userId: string, passwordHash: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const verification = em.getRepository(Verification);
        const identifier = LOCAL_CREDENTIAL_IDENTIFIER(userId);
        const existing = await verification.findOne({ where: { identifier } });
        if (existing) {
            await verification.update({ id: existing.id }, { value: passwordHash });
            return;
        }
        const row = verification.create({ identifier, value: passwordHash, expiresAt: LOCAL_CREDENTIAL_EXPIRES_AT });
        await verification.save(row);
    }

    async createUserAccount(dto: CreateUserAccountDto, em: EntityManager = this.dataSource.createEntityManager()) {
        const userRepo = em.getRepository(User);
        const user = userRepo.create({ email: dto.email, status: UserStatus.SUSPENDED });
        const savedUser = await userRepo.save(user);

        const profile = em.create(Profile, { userId: savedUser.id, fullName: `${dto.firstName} ${dto.lastName}` });
        await em.save(profile);

        const client = em.create(Client, { userId: savedUser.id });
        await em.save(client);

        const credential = em.create(Verification, {
            identifier: LOCAL_CREDENTIAL_IDENTIFIER(savedUser.id),
            value: dto.password,
            expiresAt: LOCAL_CREDENTIAL_EXPIRES_AT,
        });
        await em.save(credential);

        savedUser.profile = profile;
        return savedUser;
    }

    private async loadUserWithProfile(where: { email: string } | { id: string }, em: EntityManager) {
        const userRepo = em.getRepository(User);
        const user = await userRepo.findOne({ where });
        if (!user) return null;
        const profile = await em.getRepository(Profile).findOne({ where: { userId: user.id } });
        if (profile) user.profile = profile;
        return user;
    }
}
