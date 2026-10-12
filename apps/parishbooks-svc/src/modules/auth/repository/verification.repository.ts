import { Verification } from '@parishbooks/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type UpsertVerificationInput = {
    identifier: string;
    value: string;
    expiresAt: Date;
};

@Injectable()
export class VerificationRepository {
    constructor(@InjectRepository(Verification) private readonly verificationRepo: Repository<Verification>) {}

    findByIdentifier(identifier: string) {
        return this.verificationRepo.findOne({ where: { identifier } });
    }

    async upsertByIdentifier(input: UpsertVerificationInput): Promise<Verification> {
        const existing = await this.findByIdentifier(input.identifier);
        if (existing) {
            existing.value = input.value;
            existing.expiresAt = input.expiresAt;
            return this.verificationRepo.save(existing);
        }
        const row = this.verificationRepo.create(input);
        return this.verificationRepo.save(row);
    }

    async deleteByIdentifier(identifier: string): Promise<void> {
        await this.verificationRepo.delete({ identifier });
    }
}
