import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfilePasswordHash1791864000000 implements MigrationInterface {
    name = 'ProfilePasswordHash1791864000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "password_hash" text`);
        await queryRunner.query(`
            UPDATE "profile" p
            SET "password_hash" = v."value"
            FROM "verification" v
            WHERE v."identifier" = 'credential:' || p."user_id"::text
        `);
        await queryRunner.query(`DELETE FROM "verification" WHERE "identifier" LIKE 'credential:%'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "password_hash"`);
    }
}
