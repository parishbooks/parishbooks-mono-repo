import { Verification } from '@parishbooks/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export type UpsertVerificationInput = {
    identifier: string;
    value: string;
    expiresAt: Date;
};

@Injectable()
export class VerificationRepository {
    constructor(@InjectRepository(Verification) private readonly verificationRepo: Repository<Verification>) {}

    findByIdentifier(identifier: string, em?: EntityManager) {
        return this.repository(em).findOne({ where: { identifier } });
    }

    async upsertByIdentifier(input: UpsertVerificationInput, em?: EntityManager): Promise<Verification> {
        const repo = this.repository(em);
        const existing = await repo.findOne({ where: { identifier: input.identifier } });
        if (existing) {
            existing.value = input.value;
            existing.expiresAt = input.expiresAt;
            return repo.save(existing);
        }
        const row = repo.create(input);
        return repo.save(row);
    }

    async deleteByIdentifier(identifier: string, em?: EntityManager): Promise<void> {
        await this.repository(em).delete({ identifier });
    }

    private repository(em?: EntityManager): Repository<Verification> {
        return em ? em.getRepository(Verification) : this.verificationRepo;
    }
}
