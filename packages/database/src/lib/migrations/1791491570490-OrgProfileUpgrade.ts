import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgProfileUpgrade1791491570490 implements MigrationInterface {
    name = 'OrgProfileUpgrade1791491570490';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_profile" ADD COLUMN IF NOT EXISTS "legal_name" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "organization_profile" SET "legal_name" = '' WHERE "legal_name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "legal_name" DROP DEFAULT`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_language_enum" AS ENUM('en')`);
        await queryRunner.query(`ALTER TABLE "organization_profile" ADD "language" "public"."organization_profile_language_enum" NOT NULL DEFAULT 'en'`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_fiscal_year_enum" AS ENUM('jan_dec', 'apr_mar', 'jul_jun')`);
        await queryRunner.query(
            `ALTER TABLE "organization_profile" ADD "fiscal_year" "public"."organization_profile_fiscal_year_enum" NOT NULL DEFAULT 'jan_dec'`,
        );
        await queryRunner.query(`ALTER TYPE "public"."organization_profile_country_enum" RENAME TO "organization_profile_country_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_country_enum" AS ENUM('IN')`);
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "country" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "organization_profile" ALTER COLUMN "country" TYPE "public"."organization_profile_country_enum" USING "country"::"text"::"public"."organization_profile_country_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "country" SET DEFAULT 'IN'`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_country_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."organization_profile_currency_enum" RENAME TO "organization_profile_currency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_currency_enum" AS ENUM('INR')`);
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "currency" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "organization_profile" ALTER COLUMN "currency" TYPE "public"."organization_profile_currency_enum" USING "currency"::"text"::"public"."organization_profile_currency_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "currency" SET DEFAULT 'INR'`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_currency_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_currency_enum_old" AS ENUM('INR', 'USD')`);
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "currency" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "organization_profile" ALTER COLUMN "currency" TYPE "public"."organization_profile_currency_enum_old" USING "currency"::"text"::"public"."organization_profile_currency_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "currency" SET DEFAULT 'INR'`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_currency_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."organization_profile_currency_enum_old" RENAME TO "organization_profile_currency_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."organization_profile_country_enum_old" AS ENUM('IN', 'US')`);
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "country" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "organization_profile" ALTER COLUMN "country" TYPE "public"."organization_profile_country_enum_old" USING "country"::"text"::"public"."organization_profile_country_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "organization_profile" ALTER COLUMN "country" SET DEFAULT 'IN'`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_country_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."organization_profile_country_enum_old" RENAME TO "organization_profile_country_enum"`);
        await queryRunner.query(`ALTER TABLE "organization_profile" DROP COLUMN "fiscal_year"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_fiscal_year_enum"`);
        await queryRunner.query(`ALTER TABLE "organization_profile" DROP COLUMN "language"`);
        await queryRunner.query(`DROP TYPE "public"."organization_profile_language_enum"`);
        await queryRunner.query(`ALTER TABLE "organization_profile" DROP COLUMN "legal_name"`);
    }
}
