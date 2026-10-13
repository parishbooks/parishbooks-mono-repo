import { MigrationInterface, QueryRunner } from 'typeorm';

/** Repairs DBs that ran an earlier draft of RenameProfilePasswordColumn (ADD password instead of RENAME). */
export class ProfilePasswordColumnSync1791866500000 implements MigrationInterface {
    name = 'ProfilePasswordColumnSync1791866500000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasPasswordHash = await queryRunner.query(`
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'profile' AND column_name = 'password_hash'
        `);
        if (hasPasswordHash.length === 0) return;

        await queryRunner.query(`
            UPDATE "profile"
            SET "password" = "password_hash"
            WHERE "password_hash" IS NOT NULL AND "password" IS NULL
        `);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "password_hash"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "password_hash" text`);
        await queryRunner.query(`UPDATE "profile" SET "password_hash" = "password" WHERE "password" IS NOT NULL`);
    }
}
