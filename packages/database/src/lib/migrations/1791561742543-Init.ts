import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1791561742543 implements MigrationInterface {
    name = 'Init1791561742543';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_country_enum" AS ENUM('IN')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_plan_tier_enum" AS ENUM('starter', 'pro')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_billing_status_enum" AS ENUM('active', 'pastDue', 'locked', 'canceled')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_billing_provider_enum" AS ENUM('stripe', 'cashfree')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_currency_enum" AS ENUM('INR')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_language_enum" AS ENUM('en')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_fiscal_year_enum" AS ENUM('jan_dec', 'apr_mar', 'jul_jun')`);
        await queryRunner.query(
            `CREATE TYPE "public"."organization_profile_cashfree_vendor_status_enum" AS ENUM('not_started', 'pending', 'active', 'rejected')`,
        );
        await queryRunner.query(
            `CREATE TABLE "organization_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "organization_id" uuid NOT NULL, "legal_name" text NOT NULL, "country" "public"."organization_profile_country_enum" NOT NULL DEFAULT 'IN', "fcra_registered" boolean NOT NULL DEFAULT false, "plan_tier" "public"."organization_profile_plan_tier_enum" NOT NULL DEFAULT 'starter', "billing_status" "public"."organization_profile_billing_status_enum" NOT NULL DEFAULT 'active', "billing_provider" "public"."organization_profile_billing_provider_enum", "timezone" text NOT NULL, "currency" "public"."organization_profile_currency_enum" NOT NULL DEFAULT 'INR', "language" "public"."organization_profile_language_enum" NOT NULL DEFAULT 'en', "fiscal_year" "public"."organization_profile_fiscal_year_enum" NOT NULL DEFAULT 'jan_dec', "registration_number" text, "tax_exemption_number80g" text, "ein" text, "cashfree_vendor_id" text, "cashfree_vendor_status" "public"."organization_profile_cashfree_vendor_status_enum" NOT NULL DEFAULT 'not_started', "cashfree_vendor_status_at" TIMESTAMP WITH TIME ZONE, "cashfree_vendor_rejection_reason" text, CONSTRAINT "UQ_db65c4ae2d07b920efb5d9d5cbe" UNIQUE ("organization_id"), CONSTRAINT "REL_db65c4ae2d07b920efb5d9d5cb" UNIQUE ("organization_id"), CONSTRAINT "PK_a459f7af77cb9a0fd82286f661a" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" text NOT NULL, "slug" text NOT NULL, CONSTRAINT "UQ_abfd243f7bd832e806d19c5a919" UNIQUE ("slug"), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "tenant_id" uuid NOT NULL, "name" text NOT NULL, "slug" text NOT NULL, CONSTRAINT "UQ_f6688d9865e5b48fb3c63194ad1" UNIQUE ("tenant_id", "slug"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_e50502b45eaba8ecccafe928d6" ON "organization" ("tenant_id", "id") `);
        await queryRunner.query(
            `CREATE TABLE "organization_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "organization_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" text NOT NULL DEFAULT 'member', CONSTRAINT "UQ_ade1a22b88a5464464fe520d070" UNIQUE ("organization_id", "user_id"), CONSTRAINT "PK_81dbbb093cbe0539c170f3d1484" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_7efb1f2e807768615aba1a4d79" ON "organization_member" ("organization_id", "id") `);
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "tenant_id" uuid NOT NULL, "email" text NOT NULL, "name" text, "email_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_b8f79c6cc2a72309532fb800627" UNIQUE ("tenant_id", "email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_9a56c21022d9a4dc056d9c3757" ON "user" ("tenant_id", "id") `);
        await queryRunner.query(
            `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "provider_id" text NOT NULL, "account_id" text, "password" text, CONSTRAINT "UQ_4c4acfbdf57f81c65a880439e32" UNIQUE ("provider_id", "account_id"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_350e68c3b3ef7914e3d8c2e3a6" ON "account" ("user_id", "id") `);
        await queryRunner.query(
            `ALTER TABLE "organization_profile" ADD CONSTRAINT "FK_db65c4ae2d07b920efb5d9d5cbe" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "organization" ADD CONSTRAINT "FK_f2bc0a31155aa7f9cbe66844640" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "organization_member" ADD CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "organization_member" ADD CONSTRAINT "FK_273aa659a4afdcb614cdecbd667" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_ae07d48a61ca20ab3586d397a71" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ae07d48a61ca20ab3586d397a71"`);
        await queryRunner.query(`ALTER TABLE "organization_member" DROP CONSTRAINT "FK_273aa659a4afdcb614cdecbd667"`);
        await queryRunner.query(`ALTER TABLE "organization_member" DROP CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_f2bc0a31155aa7f9cbe66844640"`);
        await queryRunner.query(`ALTER TABLE "organization_profile" DROP CONSTRAINT "FK_db65c4ae2d07b920efb5d9d5cbe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_350e68c3b3ef7914e3d8c2e3a6"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a56c21022d9a4dc056d9c3757"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7efb1f2e807768615aba1a4d79"`);
        await queryRunner.query(`DROP TABLE "organization_member"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e50502b45eaba8ecccafe928d6"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "tenant"`);
        await queryRunner.query(`DROP TABLE "organization_profile"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_cashfree_vendor_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_fiscal_year_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_language_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_billing_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_billing_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_plan_tier_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_country_enum"`);
    }
}
