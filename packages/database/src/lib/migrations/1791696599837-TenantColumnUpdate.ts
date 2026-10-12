import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenantColumnUpdate1791696599837 implements MigrationInterface {
    name = 'TenantColumnUpdate1791696599837';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" RENAME COLUMN "slug" TO "status"`);
        await queryRunner.query(`ALTER TABLE "tenant" RENAME CONSTRAINT "UQ_abfd243f7bd832e806d19c5a919" TO "UQ_26e4cd6480e6e3a8fdfa1391e3c"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "UQ_26e4cd6480e6e3a8fdfa1391e3c"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."tenant_status_enum" AS ENUM('active', 'inactive', 'pending', 'suspended', 'deleted')`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "status" "public"."tenant_status_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."tenant_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "status" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "UQ_26e4cd6480e6e3a8fdfa1391e3c" UNIQUE ("status")`);
        await queryRunner.query(`ALTER TABLE "tenant" RENAME CONSTRAINT "UQ_26e4cd6480e6e3a8fdfa1391e3c" TO "UQ_abfd243f7bd832e806d19c5a919"`);
        await queryRunner.query(`ALTER TABLE "tenant" RENAME COLUMN "status" TO "slug"`);
    }
}
