import { MigrationInterface, QueryRunner } from 'typeorm';

export class BannedDetailsInUserTable1791651916394 implements MigrationInterface {
    name = 'BannedDetailsInUserTable1791651916394';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "username" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "banned" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "banned_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "banned_reason" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_5329f38ecdf1b9f76d0ea1c3741" UNIQUE ("tenant_id", "username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_5329f38ecdf1b9f76d0ea1c3741"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "banned_reason"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "banned_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "banned"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    }
}
