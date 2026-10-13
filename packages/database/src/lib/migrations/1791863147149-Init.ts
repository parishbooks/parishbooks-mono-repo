import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1791863147149 implements MigrationInterface {
    name = 'Init1791863147149';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ae07d48a61ca20ab3586d397a71"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_f2bc0a31155aa7f9cbe66844640"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfadaaab56ae7b5f2d76885d03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1f2ca14ab2bd3b240423645eb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a56c21022d9a4dc056d9c3757"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e50502b45eaba8ecccafe928d6"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "UQ_35bc7e9f996e1070adb1a326596"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_b8f79c6cc2a72309532fb800627"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_5329f38ecdf1b9f76d0ea1c3741"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "UQ_f6688d9865e5b48fb3c63194ad1"`);
        await queryRunner.query(
            `CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "full_name" text, "phone" text, "avatar_url" text, "timezone" text, CONSTRAINT "UQ_d752442f45f258a8bdefeebb2f2" UNIQUE ("user_id"), CONSTRAINT "REL_d752442f45f258a8bdefeebb2f" UNIQUE ("user_id"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE TYPE "public"."member_type" AS ENUM('member', 'staff')`);
        await queryRunner.query(`CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'member', 'viewer')`);
        await queryRunner.query(`CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'revoked', 'expired')`);
        await queryRunner.query(
            `CREATE TABLE "invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "org_id" uuid NOT NULL, "email" citext NOT NULL, "type" "public"."member_type" NOT NULL DEFAULT 'member', "role" "public"."member_role" NOT NULL DEFAULT 'member', "token_hash" text NOT NULL, "status" "public"."invitation_status" NOT NULL DEFAULT 'pending', "invited_by" uuid NOT NULL, "accepted_by" uuid, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() + interval '2 days', CONSTRAINT "UQ_b827d3749ffbb3b5ab5099afd64" UNIQUE ("token_hash"), CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "invitation_org_email_pending_uq" ON "invitation" ("org_id", "email") WHERE "status" = 'pending'`);
        await queryRunner.query(`CREATE INDEX "IDX_c7dbb595d2a91b5f18f922582c" ON "invitation" ("accepted_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_e720a7c3cde7969988b5d33ca7" ON "invitation" ("invited_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_c91aefe8d5ffc200dd7a5b05f5" ON "invitation" ("org_id") `);
        await queryRunner.query(`CREATE TYPE "public"."billing_interval" AS ENUM('month', 'year')`);
        await queryRunner.query(
            `CREATE TABLE "plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "code" text NOT NULL, "name" text NOT NULL, "price_cents" integer NOT NULL DEFAULT '0', "billing_interval" "public"."billing_interval" NOT NULL DEFAULT 'month', "max_orgs" integer, "max_members_per_org" integer, "max_staff_per_org" integer, "features" jsonb NOT NULL DEFAULT '{}', "billing_price_id" text, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_453021aaffd5c166075f0e26351" UNIQUE ("billing_price_id"), CONSTRAINT "UQ_e405cbb23fb08931a48ad8c2bdb" UNIQUE ("code"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'paused')`);
        await queryRunner.query(
            `CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "client_id" uuid NOT NULL, "plan_id" uuid NOT NULL, "status" "public"."subscription_status" NOT NULL, "current_period_start" TIMESTAMP WITH TIME ZONE, "current_period_end" TIMESTAMP WITH TIME ZONE, "cancel_at_period_end" boolean NOT NULL DEFAULT false, "trial_ends_at" TIMESTAMP WITH TIME ZONE, "billing_subscription_id" text, CONSTRAINT "UQ_07c6bd92f9ab872f0f030485ea9" UNIQUE ("billing_subscription_id"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "subscription_client_live_uq" ON "subscription" ("client_id") WHERE "status" IN ('trialing','active','past_due','paused')`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_5fde988e5d9b9a522d70ebec27" ON "subscription" ("plan_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a55b52abeab47a6a73a8bb8be5" ON "subscription" ("client_id") `);
        await queryRunner.query(
            `CREATE TABLE "client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "company_name" text, "billing_customer_id" text, CONSTRAINT "UQ_2086c1a58ed8a1a2bc1ca8257bb" UNIQUE ("billing_customer_id"), CONSTRAINT "UQ_f18a6fabea7b2a90ab6bf10a650" UNIQUE ("user_id"), CONSTRAINT "REL_f18a6fabea7b2a90ab6bf10a65" UNIQUE ("user_id"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_f18a6fabea7b2a90ab6bf10a65" ON "client" ("user_id") `);
        await queryRunner.query(
            `CREATE TABLE "audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "client_id" uuid, "org_id" uuid, "actor_id" uuid, "action" text NOT NULL, "target" jsonb, CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_15a6f5aad57db494c17986ed2e" ON "audit_log" ("actor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c768a12cf221337d15b49bbf2f" ON "audit_log" ("client_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_44dd39db22fbcdfaf5a051d762" ON "audit_log" ("org_id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "organization_id"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "family_id"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "pan_number"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "better_auth_user_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_verified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "banned"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "banned_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "banned_reason"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "member" ADD "org_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ADD "type" "public"."member_type" NOT NULL DEFAULT 'member'`);
        await queryRunner.query(`ALTER TABLE "member" ADD "role" "public"."member_role" NOT NULL DEFAULT 'member'`);
        await queryRunner.query(`CREATE TYPE "public"."member_status" AS ENUM('active', 'suspended', 'removed')`);
        await queryRunner.query(`ALTER TABLE "member" ADD "status" "public"."member_status" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "member" ADD "invited_by" uuid`);
        await queryRunner.query(`ALTER TABLE "member" ADD "hired_by" uuid`);
        await queryRunner.query(`ALTER TABLE "member" ADD "starts_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member" ADD "ends_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "auth_provider_id" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_ed14f086d8dc7ded49deedfd830" UNIQUE ("auth_provider_id")`);
        await queryRunner.query(`CREATE TYPE "public"."user_status" AS ENUM('active', 'pending', 'suspended', 'deleted')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."user_status" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_login_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "client_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "settings" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" TYPE citext USING "email"::citext`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "slug" TYPE citext USING "slug"::citext`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f" UNIQUE ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_f92920b482a6ae1d93dc07ced6" ON "member" ("hired_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab0c97441a84ed5311874f0771" ON "member" ("invited_by") `);
        await queryRunner.query(`CREATE INDEX "member_org_active_idx" ON "member" ("org_id") WHERE "status" = 'active'`);
        await queryRunner.query(`CREATE INDEX "IDX_efc766611e939bdbe6f7088984" ON "member" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d348286667373cbcec5463cda5" ON "organization" ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f199083e5be015d24b1a0e52d" ON "organization" ("client_id") `);
        await queryRunner.query(
            `ALTER TABLE "member" ADD CONSTRAINT "CHK_26ea9aae3cdf96f0b43d7a957e" CHECK (starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at)`,
        );
        await queryRunner.query(
            `ALTER TABLE "member" ADD CONSTRAINT "CHK_1ec686f0605b525e7661ed1032" CHECK (("type" = 'member' AND hired_by IS NULL AND starts_at IS NULL AND ends_at IS NULL) OR ("type" = 'staff'))`,
        );
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "UQ_d6af18baa24aa91355f64bc72c6" UNIQUE ("org_id", "user_id")`);
        await queryRunner.query(
            `ALTER TABLE "member" ADD CONSTRAINT "FK_2a539db46b5339190358f17e44f" FOREIGN KEY ("org_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "member" ADD CONSTRAINT "FK_efc766611e939bdbe6f7088984d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "member" ADD CONSTRAINT "FK_ab0c97441a84ed5311874f0771e" FOREIGN KEY ("invited_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "member" ADD CONSTRAINT "FK_f92920b482a6ae1d93dc07ced63" FOREIGN KEY ("hired_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "profile" ADD CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" ADD CONSTRAINT "FK_c91aefe8d5ffc200dd7a5b05f5b" FOREIGN KEY ("org_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" ADD CONSTRAINT "FK_e720a7c3cde7969988b5d33ca75" FOREIGN KEY ("invited_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" ADD CONSTRAINT "FK_c7dbb595d2a91b5f18f922582c3" FOREIGN KEY ("accepted_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "organization" ADD CONSTRAINT "FK_0f199083e5be015d24b1a0e52df" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "organization" ADD CONSTRAINT "FK_d348286667373cbcec5463cda5b" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "subscription" ADD CONSTRAINT "FK_a55b52abeab47a6a73a8bb8be55" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "subscription" ADD CONSTRAINT "FK_5fde988e5d9b9a522d70ebec27c" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "client" ADD CONSTRAINT "FK_f18a6fabea7b2a90ab6bf10a650" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_c768a12cf221337d15b49bbf2fe" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_70430c5fa35687c06d2f626cf94" FOREIGN KEY ("org_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_15a6f5aad57db494c17986ed2e2" FOREIGN KEY ("actor_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_15a6f5aad57db494c17986ed2e2"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_70430c5fa35687c06d2f626cf94"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_c768a12cf221337d15b49bbf2fe"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_f18a6fabea7b2a90ab6bf10a650"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_5fde988e5d9b9a522d70ebec27c"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_a55b52abeab47a6a73a8bb8be55"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_d348286667373cbcec5463cda5b"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_0f199083e5be015d24b1a0e52df"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_c7dbb595d2a91b5f18f922582c3"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_e720a7c3cde7969988b5d33ca75"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_c91aefe8d5ffc200dd7a5b05f5b"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_f92920b482a6ae1d93dc07ced63"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_ab0c97441a84ed5311874f0771e"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_efc766611e939bdbe6f7088984d"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_2a539db46b5339190358f17e44f"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "UQ_d6af18baa24aa91355f64bc72c6"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "CHK_1ec686f0605b525e7661ed1032"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "CHK_26ea9aae3cdf96f0b43d7a957e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f199083e5be015d24b1a0e52d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d348286667373cbcec5463cda5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_efc766611e939bdbe6f7088984"`);
        await queryRunner.query(`DROP INDEX "public"."member_org_active_idx"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab0c97441a84ed5311874f0771"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f92920b482a6ae1d93dc07ced6"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f"`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "slug" TYPE text USING "slug"::text`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" TYPE text USING "email"::text`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "settings"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_login_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_ed14f086d8dc7ded49deedfd830"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "auth_provider_id"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "ends_at"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "starts_at"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "hired_by"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "invited_by"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."member_status"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "org_id"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "tenant_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "banned_reason" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "banned_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "banned" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tenant_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ADD "better_auth_user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "member" ADD "pan_number" text`);
        await queryRunner.query(`ALTER TABLE "member" ADD "phone" text`);
        await queryRunner.query(`ALTER TABLE "member" ADD "email" text`);
        await queryRunner.query(`ALTER TABLE "member" ADD "last_name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ADD "first_name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ADD "family_id" uuid`);
        await queryRunner.query(`ALTER TABLE "member" ADD "organization_id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44dd39db22fbcdfaf5a051d762"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c768a12cf221337d15b49bbf2f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15a6f5aad57db494c17986ed2e"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f18a6fabea7b2a90ab6bf10a65"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a55b52abeab47a6a73a8bb8be5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5fde988e5d9b9a522d70ebec27"`);
        await queryRunner.query(`DROP INDEX "public"."subscription_client_live_uq"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_status"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TYPE "public"."billing_interval"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c91aefe8d5ffc200dd7a5b05f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e720a7c3cde7969988b5d33ca7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c7dbb595d2a91b5f18f922582c"`);
        await queryRunner.query(`DROP INDEX "public"."invitation_org_email_pending_uq"`);
        await queryRunner.query(`DROP TABLE "invitation"`);
        await queryRunner.query(`DROP TYPE "public"."invitation_status"`);
        await queryRunner.query(`DROP TYPE "public"."member_role"`);
        await queryRunner.query(`DROP TYPE "public"."member_type"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_f6688d9865e5b48fb3c63194ad1" UNIQUE ("tenant_id", "slug")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_5329f38ecdf1b9f76d0ea1c3741" UNIQUE ("tenant_id", "username")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_b8f79c6cc2a72309532fb800627" UNIQUE ("tenant_id", "email")`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "UQ_35bc7e9f996e1070adb1a326596" UNIQUE ("organization_id", "better_auth_user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_e50502b45eaba8ecccafe928d6" ON "organization" ("id", "tenant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a56c21022d9a4dc056d9c3757" ON "user" ("id", "tenant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f1f2ca14ab2bd3b240423645eb" ON "member" ("id", "organization_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bfadaaab56ae7b5f2d76885d03" ON "member" ("organization_id") `);
        await queryRunner.query(
            `ALTER TABLE "organization" ADD CONSTRAINT "FK_f2bc0a31155aa7f9cbe66844640" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_ae07d48a61ca20ab3586d397a71" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }
}
