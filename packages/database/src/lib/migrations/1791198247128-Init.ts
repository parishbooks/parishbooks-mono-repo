import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1791198247128 implements MigrationInterface {
    name = 'Init1791198247128';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_68d04a5ec14354226820093a69"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f8d3266f7edacdcf8b83307812"`);
        await queryRunner.query(`ALTER TABLE "journal_line" DROP CONSTRAINT "CHK_773a097c65d9d04839bf295297"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_df83343a1390ce0949dc6d10f5" ON "donation" ("provider_payment_id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_fe130594a73213abf66205a53c" ON "donation" ("organization_id", "idempotency_key") WHERE "deleted_at" IS NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "journal_line" ADD CONSTRAINT "CHK_d0df29a81770979f39cd4724e9" CHECK (("debit" > 0 AND "credit" = 0) OR ("credit" > 0 AND "debit" = 0))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "journal_line" DROP CONSTRAINT "CHK_d0df29a81770979f39cd4724e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe130594a73213abf66205a53c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df83343a1390ce0949dc6d10f5"`);
        await queryRunner.query(
            `ALTER TABLE "journal_line" ADD CONSTRAINT "CHK_773a097c65d9d04839bf295297" CHECK ((((debit > (0)::numeric) AND (credit = (0)::numeric)) OR ((credit > (0)::numeric) AND (debit = (0)::numeric))))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_f8d3266f7edacdcf8b83307812" ON "donation" ("idempotency_key", "organization_id") WHERE (deleted_at IS NULL)`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_68d04a5ec14354226820093a69" ON "donation" ("provider_payment_id") WHERE (deleted_at IS NULL)`);
    }
}
