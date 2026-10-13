import { Client, Profile, User, UserStatus } from '@parishbooks/database';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../exceptions';
import { CreateUserAccountDto } from '../interfaces';
import { OtpHelper } from '../helpers/otp.helper';

@Injectable()
export class AuthRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    async checkUserExists(email: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const normalized = OtpHelper.normalizeAuthEmail(email);
        const user = em.getRepository(User);
        const userExists = await user.findOne({ where: { email: normalized }, withDeleted: true });
        return userExists !== null;
    }

    async getUserByEmail(email: string, em: EntityManager = this.dataSource.createEntityManager()) {
        return await this.loadUserWithProfile({ email: OtpHelper.normalizeAuthEmail(email) }, em);
    }

    async getUserById(id: string, em: EntityManager = this.dataSource.createEntityManager()) {
        return await this.loadUserWithProfile({ id }, em);
    }

    async getCredentialHash(userId: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const profile = await em.getRepository(Profile).findOne({ where: { userId } });
        return profile?.password;
    }

    async markEmailVerified(userId: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const user = em.getRepository(User);
        await user.update({ id: userId }, { status: UserStatus.ACTIVE });
    }

    async updateCredentialPassword(userId: string, passwordHash: string, em: EntityManager = this.dataSource.createEntityManager()) {
        const profile = em.getRepository(Profile);
        const result = await profile.update({ userId }, { password: passwordHash });
        if (!result.affected) throw new UserNotFoundException();
    }

    async createUserAccount(dto: CreateUserAccountDto, em: EntityManager = this.dataSource.createEntityManager()) {
        const email = OtpHelper.normalizeAuthEmail(dto.email);
        const savedUser = await this.createPendingUser(email, em);
        const profile = await this.createProfileForUser(savedUser.id, dto, em);
        await this.createClientForUser(savedUser.id, em);
        savedUser.profile = profile;
        return savedUser;
    }

    private async createPendingUser(email: string, em: EntityManager) {
        const userRepo = em.getRepository(User);
        const user = userRepo.create({ email, status: UserStatus.PENDING });
        return userRepo.save(user);
    }

    private async createProfileForUser(userId: string, dto: CreateUserAccountDto, em: EntityManager) {
        const fullName = `${dto.firstName} ${dto.lastName}`.trim();
        const profile = em.create(Profile, { userId, fullName, phone: dto.phone, password: dto.password });
        return em.save(profile);
    }

    private async createClientForUser(userId: string, em: EntityManager) {
        const client = em.create(Client, { userId });
        return em.save(client);
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
