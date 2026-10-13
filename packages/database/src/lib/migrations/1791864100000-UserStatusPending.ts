import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserStatusPending1791864100000 implements MigrationInterface {
    name = 'UserStatusPending1791864100000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."user_status" ADD VALUE IF NOT EXISTS 'pending' BEFORE 'suspended'`);
    }

    public async down(): Promise<void> {
        // Postgres cannot remove enum values without recreating the type.
    }
}
