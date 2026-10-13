import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameProfilePasswordColumn1791866401542 implements MigrationInterface {
    name = 'RenameProfilePasswordColumn1791866401542';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" RENAME COLUMN "password_hash" TO "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" RENAME COLUMN "password" TO "password_hash"`);
    }
}
