import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenantOwnerId1792008840000 implements MigrationInterface {
    name = 'TenantOwnerId1792008840000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" ADD "owner_id" uuid`);
        await queryRunner.query(`
            UPDATE "tenant" t
            SET "owner_id" = picked.user_id
            FROM (
                SELECT DISTINCT ON (u.tenant_id) u.tenant_id, u.id AS user_id
                FROM "user" u
                ORDER BY u.tenant_id, u.created_at ASC
            ) picked
            WHERE t.id = picked.tenant_id AND t.owner_id IS NULL
        `);
        await queryRunner.query(`ALTER TABLE "tenant" ALTER COLUMN "owner_id" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "tenant" ADD CONSTRAINT "FK_tenant_owner_id_user" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "FK_tenant_owner_id_user"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "owner_id"`);
    }
}
